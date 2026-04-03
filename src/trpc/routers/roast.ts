import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createRoast,
  createSubmission,
  getLeaderboardCached,
} from "@/db/queries";
import { analyzeCode } from "@/lib/roast-analysis";
import { baseProcedure, createTRPCRouter } from "../init";

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
      const analysis = await analyzeCode(
        input.sourceCode,
        input.language,
        input.roastMode,
      );

      const submission = await createSubmission({
        sourceCode: input.sourceCode,
        language: input.language as
          | "javascript"
          | "typescript"
          | "python"
          | "java"
          | "c"
          | "cpp"
          | "csharp"
          | "go"
          | "rust"
          | "ruby"
          | "php"
          | "swift"
          | "kotlin"
          | "sql"
          | "html"
          | "css"
          | "other",
        lineCount: input.lineCount,
        roastMode: input.roastMode,
      });

      if (!submission) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create submission",
        });
      }

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
    }),
});
