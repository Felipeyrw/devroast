<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DevRoast

## Stack

Next.js 16.1.6 · Tailwind v4 · Biome · pnpm · TypeScript strict · Drizzle ORM · PostgreSQL 16 (Docker) · Groq API

## Conventions

- **Named exports only** — never default exports
- **Composition pattern** — subcomponents as separate exports (e.g., `Card`, `CardBadge`, `CardTitle`)
- **Tailwind classes directly** — `bg-accent-green`, not `var(--color-*)`
- **No string interpolation in classNames** — use `tv()` slots/variants
- **`enabled:hover:`** for buttons — disabled state won't trigger hover
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

## Database

Postgres 16 via Docker Compose. Drizzle ORM com `casing: "snake_case"` (evita repetir nomes de colunas).

**⚠️ Erro comum:** `ECONNREFUSED 127.0.0.1:5432` significa que o container Postgres não está rodando. Sempre execute `docker compose up -d` antes de rodar migrations ou queries.

### Setup

```bash
docker compose up -d        # sobe o Postgres
cp .env.example .env        # se ainda não existir
pnpm db:migrate             # aplica migrations
pnpm db:studio              # UI do banco (Drizzle Studio)
```

### Scripts

| Comando | O que faz |
|---------|-----------|
| `pnpm db:generate` | Gera migration a partir do schema |
| `pnpm db:migrate` | Aplica migrations pendentes |
| `pnpm db:push` | Push direto (dev only, sem migration file) |
| `pnpm db:studio` | Abre Drizzle Studio no browser |

### Regras

- Queries em `src/db/queries.ts` — **sem** `db.query` relacional, usar joins explícitos
- Schema em `src/db/schema.ts` — enums, tabelas, constraints
- Conexão em `src/db/index.ts`
- Cada roast tem `slug varchar(12) UNIQUE` para URL pública (`/roast/{slug}`)
- `score` tem CHECK constraint (`0 a 10`)
- Stats globais (`getGlobalStats`) faz full-table scan — cachear quando necessário
