import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardBadge,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";

export default async function RoastResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="flex-1 px-10 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-10 flex items-start gap-10">
          {/* Score Ring */}
          <div className="flex flex-col items-center gap-2">
            <ScoreRing size="lg" score={2.1} color="red" />
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

            <p className="font-mono text-sm text-text-secondary">
              Analysis complete for roast ID: {id}
            </p>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-text-tertiary">
                Submitted 2 days ago
              </span>
              <span className="font-mono text-xs text-text-tertiary">·</span>
              <span className="font-mono text-xs text-accent-cyan">
                javascript
              </span>
              <span className="font-mono text-xs text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">
                24 lines
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="critical">needs_serious_help</Badge>
              <span className="font-mono text-xs text-text-tertiary">
                5 critical issues found
              </span>
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
              code={`function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`}
              language="javascript"
              showWindowHeader={true}
              filename="calculateTotal.js"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10 border-t border-border-primary" />

        {/* Analysis Section */}
        <div className="mb-10">
          <SectionTitle>analysis</SectionTitle>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Card>
              <CardBadge variant="critical">critical</CardBadge>
              <CardTitle>using var instead of const/let</CardTitle>
              <CardDescription>
                The var keyword is function-scoped rather than block-scoped,
                which can lead to unexpected behavior and bugs. Use const or let
                instead.
              </CardDescription>
            </Card>
            <Card>
              <CardBadge variant="critical">critical</CardBadge>
              <CardTitle>console.log in production code</CardTitle>
              <CardDescription>
                Remove console.log statements before deploying to production.
                Use a proper logging library instead.
              </CardDescription>
            </Card>
            <Card>
              <CardBadge variant="warning">warning</CardBadge>
              <CardTitle>missing error handling</CardTitle>
              <CardDescription>
                The function doesn&apos;t handle cases where items is null,
                undefined, or not an array. Add input validation.
              </CardDescription>
            </Card>
            <Card>
              <CardBadge variant="warning">warning</CardBadge>
              <CardTitle>TODO comments left in code</CardTitle>
              <CardDescription>
                There are unresolved TODO comments indicating incomplete
                implementation. Address these before marking as done.
              </CardDescription>
            </Card>
            <Card>
              <CardBadge variant="good">good</CardBadge>
              <CardTitle>function naming is clear</CardTitle>
              <CardDescription>
                The function name calculateTotal clearly describes its purpose,
                making the code more readable.
              </CardDescription>
            </Card>
            <Card>
              <CardBadge variant="verdict">needs_serious_help</CardBadge>
              <CardTitle>magic numbers in code</CardTitle>
              <CardDescription>
                The numbers 100 and 0.9 are magic numbers. Extract them into
                named constants for better maintainability.
              </CardDescription>
            </Card>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10 border-t border-border-primary" />

        {/* Suggestions Section */}
        <div className="mb-10">
          <SectionTitle>suggestions</SectionTitle>
          <div className="mt-4">
            <CodeBlock
              code={`function calculateTotal(items) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }

  const DISCOUNT_THRESHOLD = 100;
  const DISCOUNT_RATE = 0.9;

  let total = 0;
  for (const item of items) {
    if (typeof item.price !== 'number') {
      throw new Error('Invalid item price');
    }
    total += item.price;
  }

  if (total > DISCOUNT_THRESHOLD) {
    total *= DISCOUNT_RATE;
  }

  return total;
}`}
              language="javascript"
              showWindowHeader={true}
              filename="calculateTotal.fixed.js"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10 border-t border-border-primary" />

        {/* Metrics Section */}
        <div className="mb-10">
          <SectionTitle>metrics</SectionTitle>
          <div className="mt-4 overflow-hidden rounded border border-border-primary">
            {/* Header */}
            <div className="flex items-center border-b border-border-primary bg-bg-surface px-5 py-3">
              <span className="flex-1 font-mono text-xs text-text-tertiary">
                Metric
              </span>
              <span className="w-32 text-right font-mono text-xs text-text-tertiary">
                Value
              </span>
              <span className="w-32 text-right font-mono text-xs text-text-tertiary">
                Rating
              </span>
            </div>

            {/* Rows */}
            <div className="flex items-center border-b border-border-primary px-5 py-4">
              <span className="flex-1 font-mono text-sm text-text-primary">
                Cyclomatic Complexity
              </span>
              <span className="w-32 text-right font-mono text-sm text-text-primary">
                3
              </span>
              <span className="w-32 text-right font-mono text-xs text-accent-green">
                good
              </span>
            </div>
            <div className="flex items-center border-b border-border-primary px-5 py-4">
              <span className="flex-1 font-mono text-sm text-text-primary">
                Lines of Code
              </span>
              <span className="w-32 text-right font-mono text-sm text-text-primary">
                12
              </span>
              <span className="w-32 text-right font-mono text-xs text-accent-green">
                good
              </span>
            </div>
            <div className="flex items-center border-b border-border-primary px-5 py-4">
              <span className="flex-1 font-mono text-sm text-text-primary">
                Readability Score
              </span>
              <span className="w-32 text-right font-mono text-sm text-text-primary">
                45/100
              </span>
              <span className="w-32 text-right font-mono text-xs text-accent-red">
                poor
              </span>
            </div>
            <div className="flex items-center border-b border-border-primary px-5 py-4">
              <span className="flex-1 font-mono text-sm text-text-primary">
                Maintainability Index
              </span>
              <span className="w-32 text-right font-mono text-sm text-text-primary">
                62/100
              </span>
              <span className="w-32 text-right font-mono text-xs text-accent-amber">
                fair
              </span>
            </div>
            <div className="flex items-center px-5 py-4">
              <span className="flex-1 font-mono text-sm text-text-primary">
                Code Duplication
              </span>
              <span className="w-32 text-right font-mono text-sm text-text-primary">
                0%
              </span>
              <span className="w-32 text-right font-mono text-xs text-accent-green">
                good
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
