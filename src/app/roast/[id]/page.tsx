import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import { CodeDiff } from "@/components/code-diff";
import { ShareButton } from "@/components/share-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardBadge,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";
import { getRoastBySlug } from "@/db/queries";

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  return `${diffMonth}mo ago`;
}

function getScoreColor(score: number): "red" | "amber" | "green" {
  if (score < 4) return "red";
  if (score < 7) return "amber";
  return "green";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const roast = await getRoastBySlug(id);

  if (!roast) {
    return {
      title: "Roast not found — devroast",
    };
  }

  const score = Number(roast.score);

  return {
    title: `Score ${score}/10 — ${roast.verdict} — devroast`,
    description: roast.roastQuote,
    openGraph: {
      title: `Score ${score}/10 — ${roast.verdict}`,
      description: roast.roastQuote,
      images: [`/roast/${id}/og`],
    },
    twitter: {
      card: "summary_large_image",
      title: `Score ${score}/10 — ${roast.verdict}`,
      description: roast.roastQuote,
      images: [`/roast/${id}/og`],
    },
  };
}

export default async function RoastResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const roast = await getRoastBySlug(id);

  if (!roast) {
    notFound();
  }

  const score = Number(roast.score);
  const scoreColor = getScoreColor(score);

  return (
    <main className="flex-1 px-10 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-10 flex items-start gap-10">
          {/* Score Ring */}
          <div className="flex flex-col items-center gap-2">
            <ScoreRing size="lg" score={score} color={scoreColor} />
            <span className="font-mono text-xs text-text-tertiary">
              overall score
            </span>
          </div>

          {/* Info Section */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 text-accent-green"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <h1 className="font-mono text-2xl font-bold text-text-primary">
                Roast Results
              </h1>
            </div>

            <p className="font-mono text-sm text-accent-red">
              &quot;{roast.roastQuote}&quot;
            </p>

            <p className="font-mono text-xs text-text-tertiary">
              Roast ID: {roast.slug}
            </p>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-text-tertiary">
                {formatRelativeDate(new Date(roast.roastCreatedAt))}
              </span>
              <span className="font-mono text-xs text-text-tertiary">·</span>
              <span className="font-mono text-xs text-accent-cyan">
                {roast.language}
              </span>
              <span className="font-mono text-xs text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">
                {roast.lineCount} lines
              </span>
              {roast.roastMode && (
                <>
                  <span className="font-mono text-xs text-text-tertiary">
                    ·
                  </span>
                  <span className="font-mono text-xs text-accent-amber">
                    roast mode
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={roast.verdict}>{roast.verdict}</Badge>
              <span className="font-mono text-xs text-text-tertiary">
                {roast.issues.length} issues found
              </span>
              <ShareButton slug={roast.slug} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10 border-t border-border-primary" />

        {/* Submitted Code Section */}
        <div className="mb-10">
          <SectionTitle>submitted_code</SectionTitle>
          <div className="mt-4">
            <CodeBlock
              code={roast.sourceCode}
              language={roast.language}
              showWindowHeader
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10 border-t border-border-primary" />

        {/* Analysis Section */}
        {roast.issues.length > 0 && (
          <>
            <div className="mb-10">
              <SectionTitle>analysis</SectionTitle>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {roast.issues.map((issue) => (
                  <Card key={issue.id}>
                    <CardBadge variant={issue.severity}>
                      {issue.severity}
                    </CardBadge>
                    <CardTitle>{issue.title}</CardTitle>
                    <CardDescription>{issue.description}</CardDescription>
                  </Card>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mb-10 border-t border-border-primary" />
          </>
        )}

        {/* Improved Code Diff Section */}
        {roast.improvedCode && (
          <>
            <div className="mb-10">
              <SectionTitle>suggested_improvements</SectionTitle>
              <p className="mt-2 font-mono text-xs text-text-tertiary">
                {"//"} red lines removed, green lines added
              </p>
              <div className="mt-4">
                <CodeDiff
                  original={roast.sourceCode}
                  improved={roast.improvedCode}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="mb-10 border-t border-border-primary" />
          </>
        )}
      </div>
    </main>
  );
}
