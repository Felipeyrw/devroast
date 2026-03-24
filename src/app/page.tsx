import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { TableRow, TableRowCell } from "@/components/ui/table-row";
import { Toggle, ToggleLabel } from "@/components/ui/toggle";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex w-full max-w-4xl flex-col gap-12 px-10 py-20">
        {/* Hero Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-4xl font-bold text-accent-green">
              {"$"}
            </span>
            <h1 className="font-mono text-4xl font-bold text-text-primary">
              paste your code. get roasted.
            </h1>
          </div>
          <p className="font-mono text-sm text-text-secondary">
            {"//"} drop your code below and we&apos;ll rate it — brutally
            honest or full roast mode
          </p>
        </div>

        {/* Code Input */}
        <div className="overflow-hidden rounded border border-border-primary bg-bg-input">
          {/* Window Header */}
          <div className="flex h-10 items-center border-b border-border-primary px-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-accent-red" />
              <span className="size-3 rounded-full bg-accent-amber" />
              <span className="size-3 rounded-full bg-accent-green" />
            </div>
          </div>

          {/* Textarea */}
          <textarea
            spellCheck={false}
            rows={16}
            className="w-full resize-none bg-transparent px-4 py-4 font-mono text-xs leading-6 text-text-primary outline-none placeholder:text-text-tertiary"
            placeholder="paste your code here..."
          />
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Toggle size="md" defaultChecked />
            <ToggleLabel>roast mode</ToggleLabel>
            <span className="font-mono text-xs text-text-tertiary">
              {"//"} maximum sarcasm enabled
            </span>
          </div>
          <Button variant="primary" size="md">
            roast_my_code
          </Button>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-center gap-6">
          <span className="font-mono text-xs text-text-tertiary">
            2,847 codes roasted
          </span>
          <span className="font-mono text-xs text-text-tertiary">{"·"}</span>
          <span className="font-mono text-xs text-text-tertiary">
            avg score: 4.2/10
          </span>
        </div>

        {/* Spacer */}
        <div className="h-8" />

        {/* Leaderboard Preview */}
        <div className="flex flex-col gap-6">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <SectionTitle>shame_leaderboard</SectionTitle>
            <div className="border border-border-primary px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors enabled:hover:text-text-primary">
              view_all {"<<"}
            </div>
          </div>

          {/* Subtitle */}
          <p className="font-mono text-xs text-text-tertiary">
            {"//"} the worst code on the internet, ranked by shame
          </p>

          {/* Table */}
          <div className="overflow-hidden rounded border border-border-primary">
            {/* Header */}
            <div className="flex h-10 items-center gap-0 bg-bg-surface px-5">
              <span className="w-[50px] font-mono text-xs font-medium text-text-tertiary">
                #
              </span>
              <span className="w-[70px] font-mono text-xs font-medium text-text-tertiary">
                score
              </span>
              <span className="flex-1 font-mono text-xs font-medium text-text-tertiary">
                code
              </span>
              <span className="w-[100px] text-right font-mono text-xs font-medium text-text-tertiary">
                lang
              </span>
            </div>

            {/* Rows */}
            <TableRow>
              <TableRowCell variant="rank">1</TableRowCell>
              <TableRowCell variant="score">1.2</TableRowCell>
              <TableRowCell variant="code">
                <div>eval(prompt(&quot;enter code&quot;))</div>
                <div>document.write(response)</div>
                <div className="text-text-tertiary">{"//"} trust the user lol</div>
              </TableRowCell>
              <TableRowCell variant="lang">javascript</TableRowCell>
            </TableRow>
            <TableRow>
              <TableRowCell variant="rank">2</TableRowCell>
              <TableRowCell variant="score">1.8</TableRowCell>
              <TableRowCell variant="code">
                <div>if (x == true) {`{ return true; }`}</div>
                <div>else if (x == false) {`{ return false; }`}</div>
                <div>else {`{ return !false; }`}</div>
              </TableRowCell>
              <TableRowCell variant="lang">typescript</TableRowCell>
            </TableRow>
            <TableRow>
              <TableRowCell variant="rank">3</TableRowCell>
              <TableRowCell variant="score">2.1</TableRowCell>
              <TableRowCell variant="code">
                <div>SELECT * FROM users WHERE 1=1</div>
                <div className="text-text-tertiary">{"--"} TODO: add authentication</div>
              </TableRowCell>
              <TableRowCell variant="lang">sql</TableRowCell>
            </TableRow>
          </div>

          {/* Footer */}
          <div className="flex justify-center py-4">
            <a
              href="/leaderboard"
              className="font-mono text-xs text-text-tertiary transition-colors hover:text-text-secondary"
            >
              showing top 3 of 2,847 · view full leaderboard {"<<"}
            </a>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-16" />
      </div>
    </main>
  );
}
