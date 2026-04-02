import { CodeBlock } from "@/components/code-block";
import { LeaderboardFilters } from "@/components/leaderboard-filters";

export default function LeaderboardPage() {
  return (
    <main className="flex-1 px-10 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 text-accent-amber"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" />
              </svg>
              <h1 className="font-mono text-2xl font-bold text-text-primary">
                Shame Leaderboard
              </h1>
            </div>
            <p className="font-mono text-sm text-text-secondary">
              The worst code submissions that got roasted the hardest
            </p>
            <LeaderboardFilters />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 flex gap-16">
          <div>
            <p className="font-mono text-xs text-text-tertiary">Total Roasts</p>
            <p className="font-mono text-3xl font-bold text-text-primary">
              1,247
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-text-tertiary">Avg Score</p>
            <p className="font-mono text-3xl font-bold text-accent-amber">
              4.2
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-text-tertiary">Worst Score</p>
            <p className="font-mono text-3xl font-bold text-accent-red">0.3</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border-primary">
          {/* Table Header */}
          <div className="flex items-center border-b border-border-primary bg-bg-elevated px-5 py-3">
            <span className="w-16 font-mono text-xs text-text-tertiary">
              Rank
            </span>
            <span className="flex-1 font-mono text-xs text-text-tertiary">
              Roast
            </span>
            <span className="w-32 text-right font-mono text-xs text-text-tertiary">
              Created At
            </span>
          </div>

          {/* Row 1 */}
          <div className="flex border-b border-border-primary px-5 py-4">
            <div className="flex w-16 items-start">
              <span className="font-mono text-xs font-bold text-accent-amber">
                #1
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-text-tertiary">
                  @user1
                </span>
                <span className="font-mono text-xs text-accent-red">1.2</span>
              </div>
              <CodeBlock
                code="function test() { var x = 1; return x; }"
                language="javascript"
              />
              <div className="flex gap-2">
                <span className="font-mono text-xs text-accent-cyan">
                  javascript
                </span>
              </div>
            </div>
            <div className="flex w-32 items-start justify-end">
              <span className="font-mono text-xs text-text-secondary">
                2d ago
              </span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex border-b border-border-primary px-5 py-4">
            <div className="flex w-16 items-start">
              <span className="font-mono text-xs font-bold text-text-secondary">
                #2
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-text-tertiary">
                  @user2
                </span>
                <span className="font-mono text-xs text-accent-red">1.8</span>
              </div>
              <CodeBlock
                code="const arr = []; for(var i=0;i<10;i++){arr.push(i)}"
                language="javascript"
              />
              <div className="flex gap-2">
                <span className="font-mono text-xs text-accent-cyan">
                  javascript
                </span>
              </div>
            </div>
            <div className="flex w-32 items-start justify-end">
              <span className="font-mono text-xs text-text-secondary">
                5d ago
              </span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex border-b border-border-primary px-5 py-4">
            <div className="flex w-16 items-start">
              <span className="font-mono text-xs font-bold text-text-secondary">
                #3
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-text-tertiary">
                  @user3
                </span>
                <span className="font-mono text-xs text-accent-red">2.1</span>
              </div>
              <CodeBlock
                code={`def hello():\n    print("hello")\n    return None`}
                language="python"
              />
              <div className="flex gap-2">
                <span className="font-mono text-xs text-accent-cyan">
                  python
                </span>
              </div>
            </div>
            <div className="flex w-32 items-start justify-end">
              <span className="font-mono text-xs text-text-secondary">
                1w ago
              </span>
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex border-b border-border-primary px-5 py-4">
            <div className="flex w-16 items-start">
              <span className="font-mono text-xs font-bold text-text-secondary">
                #4
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-text-tertiary">
                  @user4
                </span>
                <span className="font-mono text-xs text-accent-red">2.4</span>
              </div>
              <CodeBlock code="SELECT * FROM users WHERE 1=1" language="sql" />
              <div className="flex gap-2">
                <span className="font-mono text-xs text-accent-cyan">sql</span>
              </div>
            </div>
            <div className="flex w-32 items-start justify-end">
              <span className="font-mono text-xs text-text-secondary">
                2w ago
              </span>
            </div>
          </div>

          {/* Row 5 */}
          <div className="flex px-5 py-4">
            <div className="flex w-16 items-start">
              <span className="font-mono text-xs font-bold text-text-secondary">
                #5
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-text-tertiary">
                  @user5
                </span>
                <span className="font-mono text-xs text-accent-red">2.7</span>
              </div>
              <CodeBlock
                code={`int main() {\n  printf("hello");\n  return 0;\n}`}
                language="c"
              />
              <div className="flex gap-2">
                <span className="font-mono text-xs text-accent-cyan">c</span>
              </div>
            </div>
            <div className="flex w-32 items-start justify-end">
              <span className="font-mono text-xs text-text-secondary">
                3w ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
