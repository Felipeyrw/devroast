# tRPC Patterns

## Arquitetura

```
Server Component (page.tsx)
  │  prefetch(trpc.xxx.queryOptions())
  │
  ▼
<HydrateClient>  ← dehydrate(queryClient)
  │
  ▼
Client Component ('use client')
  │  useQuery(trpc.xxx.queryOptions())
  │
  ▼
/api/trpc/[trpc]  ← fetchRequestHandler
  │
  ▼
Procedure → src/db/queries.ts
```

## Fluxo de Context

| Cenário | Context |
|---------|---------|
| API route | `createContext: () => createTRPCContext({ headers: req.headers })` |
| Server caller | `createTRPCContext({ headers: await headers() })` via `next/headers` |

## Files

| File | Role | Import safety |
|------|------|---------------|
| `init.ts` | `createTRPCContext`, `baseProcedure`, `loggedProcedure` | — |
| `query-client.ts` | `makeQueryClient()` com SSR defaults | — |
| `client.tsx` | `TRPCProvider`, `useTRPC` | `"use client"` |
| `server.tsx` | `trpc` proxy, `caller`, `prefetch`, `HydrateClient` | `"server-only"` |
| `routers/_app.ts` | Root router + `AppRouter` type | — |
| `routers/stats.ts` | `stats.global` | — |

## Regras

- **Nunca** importar `appRouter` real no client — usar apenas `import type { AppRouter }`
- `server.tsx` deve ter `import "server-only"` — impede import acidental no client
- Procedures importam funções de `src/db/queries.ts` — queries não são definidas em routers
- Routers ficam em `src/trpc/routers/` — um arquivo por domínio
- `force-dynamic` em pages que usam `prefetch()` — `headers()` falha no prerender

## Padrões de Uso

### Prefetch em Server Component

```tsx
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Page() {
  prefetch(trpc.stats.global.queryOptions());

  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
```

### Query em Client Component

```tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function ClientComponent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.stats.global.queryOptions());
}
```

### Caller direto (sem HTTP, sem hidratar para o client)

```tsx
import { caller } from "@/trpc/server";

export default async function Page() {
  const stats = await caller.stats.global();
}
```

### QueryClient config

- `staleTime: 30s` — evita refetch imediato após SSR
- `refetchOnWindowFocus: false` — evita requests ao trocar de aba
- `shouldDehydrateQuery` inclui `pending` — suporta streaming com Suspense
