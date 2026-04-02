# UI Components Patterns

## File Structure

Each component lives in its own file under `src/components/ui/`:

```
src/components/ui/
├── AGENTS.md
├── badge.tsx
├── button.tsx
├── card.tsx
├── diff-line.tsx
├── navbar.tsx
├── score-ring.tsx
├── section-title.tsx
├── table-row.tsx
└── toggle.tsx
```

## Naming Conventions

- **File names**: kebab-case (`diff-line.tsx`)
- **Component names**: PascalCase (`DiffLine`)
- **Style names**: camelCase + "Styles" suffix (`diffLineStyles`)
- **Exports**: named exports only (never default)

## Composition Pattern

Components with multiple visual parts use **separate exports** for each subcomponent, not props:

**Before (props):**
```tsx
<Card header="critical" title="Problem" description="Description..." />
```

**After (composition):**
```tsx
<Card>
  <CardBadge variant="critical">critical</CardBadge>
  <CardTitle>Problem</CardTitle>
  <CardDescription>Description...</CardDescription>
</Card>
```

### Rules for Composition

1. **Container component** — minimal, just provides layout/styling (`Card`, `TableRow`, `Toggle`)
2. **Subcomponents** — separate exports, each with own props (`CardBadge`, `CardTitle`, etc.)
3. **No compound pattern** — never use `Component.Subcomponent` (e.g., `Card.Badge`), always use separate imports
4. **Variants on subcomponents** — when a subpart has visual variants, put the variant prop on that subcomponent (`CardBadge variant="critical"`)

### Example: Card Composition

```tsx
// card.tsx exports:
Card, CardBadge, CardTitle, CardDescription

// Usage:
<Card>
  <CardBadge variant="critical">critical</CardBadge>
  <CardTitle>using var instead of const/let</CardTitle>
  <CardDescription>the var keyword is function-scoped...</CardDescription>
</Card>
```

### Example: TableRow Composition

```tsx
// table-row.tsx exports:
TableRow, TableRowCell

// Usage:
<TableRow>
  <TableRowCell variant="rank">1</TableRowCell>
  <TableRowCell variant="score">1.2</TableRowCell>
  <TableRowCell variant="code">function test() { ... }</TableRowCell>
  <TableRowCell variant="lang">javascript</TableRowCell>
</TableRow>
```

## Styling Rules

- Use `tailwind-variants` (`tv`) for variant management
- **Never use `twMerge`** when passing `className` to variants — tailwind-variants handles the merge automatically
- Use Tailwind classes directly: `bg-accent-green`, `text-text-primary`
- Use Tailwind font families: `font-sans` for body text, `font-mono` for code/monospaced
- **Never use `font-primary` or `font-secondary`** — use `font-sans` and `font-mono` instead

## Behavioral Components (base-ui)

For components with interaction behavior, use `@base-ui/react` headless primitives:
- **Toggle/Switch**: `@base-ui/react/switch` — `Switch.Root` + `Switch.Thumb`
- Style with Tailwind using `data-[checked]`, `data-[disabled]` states
- base-ui handles ARIA, keyboard, and focus management

## Rules

1. **Always extend native HTML props** — use `React.HTMLAttributes<element>` or specific element props
2. **Never use string interpolation** for classNames — use `tv()` slots/variants instead
3. **Export the styles function** — allows composing styles in parent components
4. **Use Tailwind classes directly** — `bg-accent-green`, not `bg-[var(--color-accent-green)]`
5. **Use `font-mono`** for monospaced text, **`font-sans`** for body text
6. **Never use `font-primary` or `font-secondary`** — use Tailwind's default font families
7. **JSX `//` text** — wrap in braces `{"//"}` to avoid parser errors
8. **Use `enabled:hover:`** instead of `hover:` for buttons (disabled state won't trigger hover)

## Component Index

| Component | File | Exports | Variants |
|-----------|------|---------|----------|
| Badge | `badge.tsx` | Badge | variant: critical, warning, good, verdict |
| Button | `button.tsx` | Button | variant: primary, secondary, link · size: sm, md, lg |
| Card | `card.tsx` | Card, CardBadge, CardTitle, CardDescription | CardBadge variant: critical, warning, good, verdict |
| DiffLine | `diff-line.tsx` | DiffLine | type: removed, added, context |
| Navbar | `navbar.tsx` | Navbar, NavbarLogo | — |
| ScoreRing | `score-ring.tsx` | ScoreRing | size: sm, md, lg · color: amber, green, red |
| SectionTitle | `section-title.tsx` | SectionTitle | size: sm, md, lg |
| TableRow | `table-row.tsx` | TableRow, TableRowCell | TableRowCell variant: rank, score, code, lang |
| Toggle | `toggle.tsx` | Toggle, ToggleLabel | size: sm, md · base-ui Switch |
| Skeleton | `skeleton.tsx` | Skeleton, skeleton (styles) | — |
