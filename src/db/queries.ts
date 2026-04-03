import { asc, avg, count, eq, min, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "./index";
import { issues, roasts, submissions } from "./schema";

// ── Helpers ────────────────────────────────────────────────────────────

const SLUG_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

function generateSlug(length = 8): string {
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += SLUG_CHARS[Math.floor(Math.random() * SLUG_CHARS.length)];
  }
  return slug;
}

// ── Inserts ────────────────────────────────────────────────────────────

export async function createSubmission(data: {
  sourceCode: string;
  language: (typeof submissions.language.enumValues)[number];
  lineCount: number;
  roastMode?: boolean;
}) {
  const [row] = await db
    .insert(submissions)
    .values(data)
    .returning({ id: submissions.id });
  return row;
}

export async function createRoast(
  submissionId: string,
  data: {
    score: string;
    verdict: (typeof roasts.verdict.enumValues)[number];
    roastQuote: string;
    improvedCode?: string;
    rawResponse: unknown;
  },
  issueList: {
    severity: (typeof issues.severity.enumValues)[number];
    title: string;
    description: string;
  }[],
) {
  return db.transaction(async (tx) => {
    const [roast] = await tx
      .insert(roasts)
      .values({ ...data, submissionId, slug: generateSlug() })
      .returning({ id: roasts.id, slug: roasts.slug });

    if (issueList.length > 0) {
      await tx.insert(issues).values(
        issueList.map((issue, i) => ({
          ...issue,
          roastId: roast.id,
          sortOrder: i,
        })),
      );
    }

    return roast;
  });
}

// ── Reads (explicit joins, no relational query API) ────────────────────

export type LeaderboardPeriod = "all-time" | "this-month";

export async function getLeaderboard(
  limit = 50,
  period: LeaderboardPeriod = "all-time",
) {
  const query = db
    .select({
      slug: roasts.slug,
      score: roasts.score,
      sourceCode: submissions.sourceCode,
      language: submissions.language,
      lineCount: submissions.lineCount,
      createdAt: submissions.createdAt,
    })
    .from(roasts)
    .innerJoin(submissions, eq(submissions.id, roasts.submissionId));

  if (period === "this-month") {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return query
      .where(sql`${submissions.createdAt} >= ${startOfMonth}`)
      .orderBy(asc(roasts.score))
      .limit(limit);
  }

  return query.orderBy(asc(roasts.score)).limit(limit);
}

export const getLeaderboardCached = unstable_cache(
  async (limit = 50, period: LeaderboardPeriod = "all-time") =>
    getLeaderboard(limit, period),
  ["leaderboard"],
  { revalidate: 3600, tags: ["leaderboard"] },
);

export async function getRoastBySlug(slug: string) {
  const [row] = await db
    .select({
      roastId: roasts.id,
      slug: roasts.slug,
      score: roasts.score,
      verdict: roasts.verdict,
      roastQuote: roasts.roastQuote,
      improvedCode: roasts.improvedCode,
      rawResponse: roasts.rawResponse,
      roastCreatedAt: roasts.createdAt,
      sourceCode: submissions.sourceCode,
      language: submissions.language,
      lineCount: submissions.lineCount,
      roastMode: submissions.roastMode,
    })
    .from(roasts)
    .innerJoin(submissions, eq(submissions.id, roasts.submissionId))
    .where(eq(roasts.slug, slug))
    .limit(1);

  if (!row) return null;

  const roastIssues = await db
    .select({
      id: issues.id,
      severity: issues.severity,
      title: issues.title,
      description: issues.description,
    })
    .from(issues)
    .where(eq(issues.roastId, row.roastId))
    .orderBy(asc(issues.sortOrder));

  return { ...row, issues: roastIssues };
}

export async function getGlobalStats() {
  const [row] = await db
    .select({
      total: count(),
      avgScore: avg(roasts.score),
      worstScore: min(roasts.score),
    })
    .from(roasts);

  return row;
}

export const getGlobalStatsCached = unstable_cache(
  async () => getGlobalStats(),
  ["global-stats"],
  { revalidate: 3600, tags: ["stats"] },
);
