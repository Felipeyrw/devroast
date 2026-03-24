import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBadge,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { DiffLine } from "@/components/ui/diff-line";
import { Navbar, NavbarLogo } from "@/components/ui/navbar";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";
import { TableRow, TableRowCell } from "@/components/ui/table-row";
import { Toggle, ToggleLabel } from "@/components/ui/toggle";

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-bg-page">
      {/* Navbar */}
      <Navbar>
        <NavbarLogo />
        <div className="flex items-center gap-6">
          <span className="cursor-pointer font-mono text-sm text-text-secondary hover:text-text-primary">
            leaderboard
          </span>
          <span className="cursor-pointer font-mono text-sm text-text-secondary hover:text-text-primary">
            docs
          </span>
        </div>
      </Navbar>

      <div className="mx-auto max-w-4xl space-y-16 px-12 py-12">
        <header>
          <h1 className="font-mono text-3xl font-bold text-text-primary">
            {"//"} component_library
          </h1>
          <p className="mt-2 font-mono text-sm text-text-secondary">
            Visual reference for all UI components and their variants.
          </p>
        </header>

        {/* SectionTitle */}
        <section className="space-y-6">
          <SectionTitle>section_title</SectionTitle>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">sizes</h3>
            <div className="flex flex-wrap items-center gap-6">
              <SectionTitle size="sm">small_title</SectionTitle>
              <SectionTitle size="md">medium_title</SectionTitle>
              <SectionTitle size="lg">large_title</SectionTitle>
            </div>
          </div>
        </section>

        {/* Button */}
        <section className="space-y-6">
          <SectionTitle>button</SectionTitle>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">variants</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">primary</Button>
              <Button variant="secondary">secondary</Button>
              <Button variant="link">link</Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">small</Button>
              <Button size="md">medium</Button>
              <Button size="lg">large</Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">states</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button disabled>disabled</Button>
              <Button variant="secondary" disabled>
                disabled
              </Button>
            </div>
          </div>
        </section>

        {/* Toggle */}
        <section className="space-y-6">
          <SectionTitle>toggle</SectionTitle>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">sizes</h3>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <Toggle size="sm" defaultChecked />
                <ToggleLabel>small toggle</ToggleLabel>
              </div>
              <div className="flex items-center gap-3">
                <Toggle size="md" defaultChecked />
                <ToggleLabel>medium toggle</ToggleLabel>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">states</h3>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <Toggle defaultChecked />
                <ToggleLabel>on</ToggleLabel>
              </div>
              <div className="flex items-center gap-3">
                <Toggle />
                <ToggleLabel>off</ToggleLabel>
              </div>
              <div className="flex items-center gap-3">
                <Toggle disabled />
                <ToggleLabel>disabled</ToggleLabel>
              </div>
            </div>
          </div>
        </section>

        {/* Badge */}
        <section className="space-y-6">
          <SectionTitle>badge</SectionTitle>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">variants</h3>
            <div className="flex flex-wrap items-center gap-6">
              <Badge variant="critical">critical</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="good">good</Badge>
              <Badge variant="verdict">needs_serious_help</Badge>
            </div>
          </div>
        </section>

        {/* Card */}
        <section className="space-y-6">
          <SectionTitle>card</SectionTitle>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">
              analysis cards
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardBadge variant="critical">critical</CardBadge>
                <CardTitle>using var instead of const/let</CardTitle>
                <CardDescription>
                  the var keyword is function-scoped rather than block-scoped,
                  which can lead to unexpected behavior and bugs.
                </CardDescription>
              </Card>
              <Card>
                <CardBadge variant="warning">warning</CardBadge>
                <CardTitle>unused variable detected</CardTitle>
                <CardDescription>
                  the variable is declared but never used. consider removing it
                  or prefixing with underscore.
                </CardDescription>
              </Card>
              <Card>
                <CardBadge variant="good">good</CardBadge>
                <CardTitle>proper error handling</CardTitle>
                <CardDescription>
                  this function correctly wraps async operations in try/catch
                  blocks.
                </CardDescription>
              </Card>
              <Card>
                <CardBadge variant="verdict">needs_serious_help</CardBadge>
                <CardTitle>eval() usage detected</CardTitle>
                <CardDescription>
                  using eval() is a security risk and makes code harder to
                  debug.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* DiffLine */}
        <section className="space-y-6">
          <SectionTitle>diff_line</SectionTitle>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">line types</h3>
            <div className="overflow-hidden rounded border border-border-primary">
              <DiffLine type="removed" content="var total = 0;" />
              <DiffLine type="added" content="const total = 0;" />
              <DiffLine
                type="context"
                content="for (let i = 0; i < items.length; i++) {"
              />
            </div>
          </div>
        </section>

        {/* TableRow */}
        <section className="space-y-6">
          <SectionTitle>table_row</SectionTitle>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">
              leaderboard rows
            </h3>
            <div className="overflow-hidden rounded border border-border-primary">
              <TableRow>
                <TableRowCell variant="rank">#1</TableRowCell>
                <TableRowCell variant="score">2.1</TableRowCell>
                <TableRowCell variant="code">
                  function calculateTotal(items) {`{ var total = 0; ...`}
                </TableRowCell>
                <TableRowCell variant="lang">javascript</TableRowCell>
              </TableRow>
              <TableRow>
                <TableRowCell variant="rank">#2</TableRowCell>
                <TableRowCell variant="score">4.5</TableRowCell>
                <TableRowCell variant="code">
                  const handler = (e) ={" >"} {`{ eval(e.target.value) }`}
                </TableRowCell>
                <TableRowCell variant="lang">javascript</TableRowCell>
              </TableRow>
              <TableRow>
                <TableRowCell variant="rank">#3</TableRowCell>
                <TableRowCell variant="score">7.8</TableRowCell>
                <TableRowCell variant="code">
                  export const format = (d) ={" >"} d.toISOString()
                </TableRowCell>
                <TableRowCell variant="lang">typescript</TableRowCell>
              </TableRow>
            </div>
          </div>
        </section>

        {/* ScoreRing */}
        <section className="space-y-6">
          <SectionTitle>score_ring</SectionTitle>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">sizes</h3>
            <div className="flex flex-wrap items-center gap-12">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing size="sm" score={3.5} color="amber" />
                <span className="font-mono text-xs text-text-tertiary">
                  small
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing size="md" score={7.2} color="green" />
                <span className="font-mono text-xs text-text-tertiary">
                  medium
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing size="lg" score={2.1} color="red" />
                <span className="font-mono text-xs text-text-tertiary">
                  large
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-text-secondary">colors</h3>
            <div className="flex flex-wrap items-center gap-12">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={2.1} color="red" />
                <span className="font-mono text-xs text-accent-red">
                  critical
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={5.0} color="amber" />
                <span className="font-mono text-xs text-accent-amber">
                  warning
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={8.5} color="green" />
                <span className="font-mono text-xs text-accent-green">
                  good
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
