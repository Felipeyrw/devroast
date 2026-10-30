import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createRoast,
  createSubmission,
  getLeaderboardCached,
} from "@/db/queries";
import { analyzeCode } from "@/lib/roast-analysis";
import { baseProcedure, createTRPCRouter } from "../init";

const languageEnum = z.enum([
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "other",
]);

const roastResponseSchema = z.object({
  score: z.number().min(0).max(10),
  verdict: z.enum([
    "needs_serious_help",
    "mediocre",
    "acceptable",
    "good_job",
    "chefs_kiss",
  ]),
  roastQuote: z.string(),
  issues: z.array(
    z.object({
      severity: z.enum(["critical", "warning", "good"]),
      title: z.string(),
      description: z.string(),
    }),
  ),
  improvedCode: z.string().nullable().optional(),
});

type Analysis = z.infer<typeof roastResponseSchema>;

export const roastRouter = createTRPCRouter({
  leaderboard: baseProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(100).default(3),
        period: z.enum(["all-time", "this-month"]).default("all-time"),
      }),
    )
    .query(({ input }) => getLeaderboardCached(input.limit, input.period)),

  create: baseProcedure
    .input(
      z.object({
        sourceCode: z.string().min(1).max(50_000),
        language: z.string(),
        lineCount: z.number().int().positive().max(10_000),
        roastMode: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input }) => {
      let analysis: Analysis;
      try {
        analysis = await analyzeCode(
          input.sourceCode,
          input.language,
          input.roastMode,
        );
      } catch (err: unknown) {
        console.error("[roast.create] Code analysis failed:", err);
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message:
            err instanceof Error
              ? `Failed to analyze code: ${err.message}`
              : "Failed to analyze code",
        });
      }

      const parsedLanguage = languageEnum.safeParse(input.language);
      const language = parsedLanguage.success ? parsedLanguage.data : "other";

      let submission: { id: string } | undefined;
      try {
        submission = await createSubmission({
          sourceCode: input.sourceCode,
          language,
          lineCount: input.lineCount,
          roastMode: input.roastMode,
        });
      } catch (err: unknown) {
        console.error("[roast.create] Submission creation failed:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error
              ? `Failed to create submission: ${err.message}`
              : "Failed to create submission",
        });
      }

      if (!submission) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create submission",
        });
      }

      try {
        const roast = await createRoast(
          submission.id,
          {
            score: analysis.score.toFixed(1),
            verdict: analysis.verdict,
            roastQuote: analysis.roastQuote,
            improvedCode: analysis.improvedCode || undefined,
            rawResponse: analysis,
          },
          analysis.issues.map((issue) => ({
            severity: issue.severity,
            title: issue.title,
            description: issue.description,
          })),
        );

        return { slug: roast.slug };
      } catch (err: unknown) {
        console.error("[roast.create] Roast creation failed:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error
              ? `Failed to create roast: ${err.message}`
              : "Failed to create roast",
        });
      }
    }),
});
