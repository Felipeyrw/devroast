# Spec 003 — Leaderboard Page (Real Data)

## Contexto

`src/app/leaderboard/page.tsx` é 100% hardcoded (5 rows estáticas, stats fake). Precisamos de dados reais via tRPC com 20 resultados, collapsible code, e métricas reais.

## Arquitetura

Mesmo padrão da homepage: Server Component + prefetch + HydrateClient + Suspense + Skeleton.

## Mudanças

### 1. `src/db/queries.ts` — Adicionar `worstScore` a `getGlobalStats()`

```ts
// Adicionar min(score) à query existente
```

### 2. `src/trpc/routers/stats.ts` — Incluir `worstScore` no retorno

### 3. `src/app/leaderboard/page.tsx` — Server Component

- `force-dynamic`
- `void Promise.all([prefetch(stats.global), prefetch(roast.leaderboard({ limit: 20 }))])`
- `<HydrateClient>` + `<Suspense fallback={<LeaderboardFullSkeleton />}>`
- Header com stats reais (NumberFlow para total e avg)
- `LeaderboardFilters` mantido (UI-only)

### 4. `src/components/leaderboard-full.tsx` — Client component

- `useSuspenseQuery(trpc.roast.leaderboard.queryOptions({ limit: 20 }))`
- 20 rows com `CollapsibleCode` + timestamp relativo
- Timestamp: função utilitária `formatRelativeDate(date)` → "2d ago", "1w ago", "3mo ago"

### 5. `src/components/leaderboard-full-skeleton.tsx` — Skeleton

- Header com skeletons para stats
- 3 rows skeleton (não precisa 20, é apenas loading state)

## Arquivos

| Ação | Arquivo |
|------|---------|
| Modificar | `src/db/queries.ts` |
| Modificar | `src/trpc/routers/stats.ts` |
| Modificar | `src/app/leaderboard/page.tsx` |
| Criar | `src/components/leaderboard-full.tsx` |
| Criar | `src/components/leaderboard-full-skeleton.tsx` |

## To-Dos

- [ ] Adicionar `worstScore` a `getGlobalStats()`
- [ ] Atualizar `stats.global` procedure
- [ ] Criar `leaderboard-full-skeleton.tsx`
- [ ] Criar `leaderboard-full.tsx` com 20 rows + CollapsibleCode
- [ ] Reescrever `leaderboard/page.tsx` como Server Component
- [ ] `pnpm build` + `pnpm lint`
