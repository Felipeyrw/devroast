<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DevRoast

## Stack

Next.js 16.1.6 · Tailwind v4 · Biome · pnpm · TypeScript strict

## Conventions

- **Named exports only** — never default exports
- **Composition pattern** — subcomponents as separate exports (e.g., `Card`, `CardBadge`, `CardTitle`)
- **Tailwind classes directly** — `bg-accent-green`, not `var(--color-*)`
- **No string interpolation in classNames** — use `tv()` slots/variants
- **`enabled:hover:`** for buttons — disabled state won't trigger hover
- **Static data only** — no API calls yet
- **`font-mono`** / `font-sans` only — never `font-primary`/`font-secondary`
- **JSX `//`** — wrap in `{"//"}` to avoid parser errors
- **Navbar** in `layout.tsx`, not per-page

## Design Tokens

`@theme inline` in `src/app/globals.css`:

| Token | Usage |
|-------|-------|
| `bg-page` `bg-surface` `bg-elevated` `bg-input` | Backgrounds |
| `text-primary` `text-secondary` `text-tertiary` | Text |
| `border-primary` `border-focus` | Borders |
| `accent-green` `accent-red` `accent-amber` `accent-cyan` | Accents |

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `tailwind-variants` | Component variants (don't use `twMerge` directly) |
| `@base-ui/react` | Headless primitives (Toggle, etc.) |
| `shiki` | Syntax highlighting (Server Component) |

## Docs

- UI patterns: `src/components/ui/AGENTS.md`
