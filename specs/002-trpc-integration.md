# Spec 002 — tRPC v11 + TanStack React Query (Next.js App Router)

## Contexto

O projeto usa Drizzle ORM com queries em `src/db/queries.ts`. Precisamos de uma camada de API tipada com tRPC v11 integrada ao React Server Components do Next.js App Router — prefetch no server, consumo com hooks no client.

**Stack atual:** Next.js 16 · React 19 · Drizzle ORM · PostgreSQL 16 · Biome · TypeScript strict

**Docs oficiais consultadas:**
- [Next.js App Router Setup](https://trpc.io/docs/client/nextjs/app-router-setup)
- [Server Components](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [Server Actions](https://trpc.io/docs/client/nextjs/server-actions)
- [Middlewares](https://trpc.io/docs/server/middlewares)
- [Error Handling](https://trpc.io/docs/server/error-handling)
- [Data Transformers](https://trpc.io/docs/server/data-transformers)

---

## Arquitetura

```
Server Component (page.tsx)
  │  prefetch() via trpc proxy (createTRPCOptionsProxy)
  │  ou caller.roast.bySlug() (server-side call, sem HTTP)
  │
  ▼
<HydrationBoundary state={dehydrate(queryClient)}>
  │
  ▼
Client Component ('use client')
  │  useQuery(trpc.xxx.queryOptions())
  │  useMutation(trpc.xxx.mutationOptions())
  │
  ▼
httpBatchLink → /api/trpc/[trpc]
  │  fetchRequestHandler
  │  createContext({ headers: req.headers })
  │
  ▼
Procedure → middleware → handler → import de src/db/queries.ts
```

**Princípio:** Queries existentes em `src/db/queries.ts` permanecem inalteradas. Procedures importam e chamam essas funções.

### Fluxos de contexto

O `createTRPCContext` aceita `{ headers: Headers }` para ser reutilizado em dois cenários:

| Cenário | Como o context é criado |
|---------|------------------------|
| **API route** (`/api/trpc`) | `createContext: () => createTRPCContext({ headers: req.headers })` |
| **Server caller** (RSC) | `createTRPCContext({ headers: await headers() })` via `next/headers` |

---

## Dependências

```
pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod server-only client-only
```

| Pacote | Por quê |
|--------|---------|
| `@trpc/server` | Init do router, procedures, middlewares |
| `@trpc/client` | `createTRPCClient`, `httpBatchLink` |
| `@trpc/tanstack-react-query` | `createTRPCContext`, `createTRPCOptionsProxy` |
| `@tanstack/react-query` | `QueryClient`, `useQuery`, `useMutation`, `dehydrate`, `HydrationBoundary` |
| `zod` | Validação de inputs nas procedures |
| `server-only` | Import safety para `src/trpc/server.ts` |
| `client-only` | Import safety para `src/trpc/client.tsx` |

---

## Estrutura de arquivos

```
src/
├── trpc/
│   ├── init.ts              # initTRPC, createContext, baseProcedure, loggedProcedure
│   ├── query-client.ts      # makeQueryClient() com defaults de SSR
│   ├── client.tsx           # TRPCProvider, useTRPC, getQueryClient (browser)
│   ├── server.ts            # trpc proxy, caller, getQueryClient (server), prefetch, HydrateClient
│   └── routers/
│       ├── _app.ts          # appRouter (root) + AppRouter type export
│       ├── submission.ts    # procedures de submission
│       ├── roast.ts         # procedures de roast
│       └── stats.ts         # procedures de estatísticas
app/
└── api/
    └── trpc/
        └── [trpc]/
            └── route.ts     # fetch adapter (GET + POST)
```

---

## Detalhamento por arquivo

### 1. `src/trpc/init.ts` — Inicialização e middlewares

```ts
import { initTRPC, TRPCError } from "@trpc/server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  // Futuro: extrair auth de opts.headers
  return { headers: opts.headers };
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create();

// ── Helpers base ──────────────────────────────────────────────────────

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// ── Middleware de logging ─────────────────────────────────────────────

export const loggedProcedure = baseProcedure.use(async (opts) => {
  const start = Date.now();
  const result = await opts.next();
  const durationMs = Date.now() - start;
  const meta = { path: opts.path, type: opts.type, durationMs };

  if (result.ok) {
    console.log("OK request timing:", meta);
  } else {
    console.error("Non-OK request timing:", meta);
  }

  return result;
});
```

**Detalhes importantes:**

- `createTRPCContext` aceita `{ headers: Headers }` — reutilizável tanto no adapter HTTP quanto no `appRouter.createCaller()`
- O tipo do context é inferido via `Awaited<ReturnType<typeof createTRPCContext>>` — TypeScript garante que procedures/middlewares acessem o context corretamente
- `loggedProcedure` é exportado separadamente — procedures que precisam de log usam ele, outras usam `baseProcedure`

### 2. `src/trpc/query-client.ts` — Factory do QueryClient

```ts
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {},
    },
  });
}
```

**Decisões de design:**

| Opção | Valor | Por quê |
|-------|-------|---------|
| `staleTime` | `30s` | Evita refetch imediato no client após SSR hidratar |
| `refetchOnWindowFocus` | `false` | Evita requests desnecessários ao trocar de aba |
| `shouldDehydrateQuery` | inclui `pending` | Suporta streaming — RSC pode prefetch e o client consome via Suspense quando o dado chegar |

### 3. `src/trpc/client.tsx` — Provider para Client Components

```tsx
"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  })();
  return `${base}/api/trpc`;
}

export function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: getUrl(),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
```

**Detalhes importantes:**

- `'use client'` no topo — permite que Server Components importem e montem o provider
- `getQueryClient()` — no server, cria novo client por request; no browser, singleton (evita recriação em Suspense)
- `useState` para o `trpcClient` — impede recriação em re-renders
- `httpBatchLink` — agrupa múltiplas chamadas tRPC em um único request HTTP

### 4. `src/trpc/server.ts` — Proxy para Server Components

```ts
import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

// QueryClient estável por request (React.cache)
export const getQueryClient = cache(makeQueryClient);

// Proxy para prefetch/queryOptions em Server Components
export const trpc = createTRPCOptionsProxy({
  ctx: async () =>
    createTRPCContext({
      headers: await headers(),
    }),
  router: appRouter,
  queryClient: getQueryClient,
});

// Caller direto — executa procedures sem passar pelo HTTP
export const caller = appRouter.createCaller(async () =>
  createTRPCContext({ headers: await headers() }),
);

// ── Helpers ───────────────────────────────────────────────────────────

export function HydrateClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

export function prefetch(
  queryOptions: ReturnType<
    ReturnType<typeof getQueryClient>["prefetchQuery"]
  > extends Promise<infer _T>
    ? Parameters<ReturnType<typeof getQueryClient>["prefetchQuery"]>[0]
    : never,
) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(queryOptions);
}
```

**Detalhes importantes:**

- `server-only` — garante que import acidental em `'use client'` cause erro de build
- `cache(makeQueryClient)` — `React.cache` garante mesmo QueryClient por request (evita cache compartilhado entre requests)
- `createTRPCOptionsProxy` — gera `trpc.xxx.queryOptions()` tipados para usar com `prefetchQuery` / `fetchQuery`
- `caller` — executa procedures diretamente no server, sem HTTP; útil quando precisa dos dados no RSC sem hidratar para o client
- `prefetch()` — helper que chama `void queryClient.prefetchQuery()` (fire-and-forget, não bloqueia renderização)
- `HydrateClient` — wrapper conciso que substitui `<HydrationBoundary state={dehydrate(queryClient)}>`

### 5. `src/trpc/routers/_app.ts` — Root router

```ts
import { createTRPCRouter } from "../init";
import { submissionRouter } from "./submission";
import { roastRouter } from "./roast";
import { statsRouter } from "./stats";

export const appRouter = createTRPCRouter({
  submission: submissionRouter,
  roast: roastRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
```

- `AppRouter` type é importado apenas como `import type` no client — nunca importar o router real no client

### 6. `src/trpc/routers/submission.ts`

```ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure, createTRPCRouter } from "../init";
import { createSubmission } from "@/db/queries";
import { programmingLanguageEnum } from "@/db/schema";

const SUPPORTED_LANGUAGES = [
  "javascript", "typescript", "python", "rust", "go",
  "sql", "html", "css", "java", "bash", "other",
] as const;

export const submissionRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        sourceCode: z.string().min(1, "Code cannot be empty").max(50_000),
        language: z.enum(SUPPORTED_LANGUAGES),
        lineCount: z.number().int().positive().max(10_000),
        roastMode: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await createSubmission(input);
      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create submission",
        });
      }
      return { id: result.id };
    }),
});
```

**Detalhes:**

- Validação de `language` contra enum conhecido no front (não aceita qualquer string)
- `sourceCode` com `max(50_000)` — proteção contra payloads absurdos
- Erro explícito com `TRPCError` se insert falhar
- Retorna apenas `{ id }` — não expõe dados internos

### 7. `src/trpc/routers/roast.ts`

```ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure, createTRPCRouter } from "../init";
import { getRoastBySlug, getLeaderboard } from "@/db/queries";

export const roastRouter = createTRPCRouter({
  bySlug: baseProcedure
    .input(z.object({ slug: z.string().length(12) }))
    .query(async ({ input }) => {
      const roast = await getRoastBySlug(input.slug);
      if (!roast) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Roast "${input.slug}" not found`,
        });
      }
      return roast;
    }),

  leaderboard: baseProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(100).default(50),
      }),
    )
    .query(({ input }) => getLeaderboard(input.limit)),
});
```

**Detalhes:**

- `slug` com `length(12)` — bate com o `varchar(12)` do schema Drizzle
- `NOT_FOUND` explícito — client pode tratar com 404 page
- `limit` com `max(100)` — evita queries gigantes

### 8. `src/trpc/routers/stats.ts`

```ts
import { baseProcedure, createTRPCRouter } from "../init";
import { getGlobalStats } from "@/db/queries";

export const statsRouter = createTRPCRouter({
  global: baseProcedure.query(() => getGlobalStats()),
});
```

### 9. `app/api/trpc/[trpc]/route.ts` — HTTP Adapter

```ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
  });

export { handler as GET, handler as POST };
```

**Detalhes:**

- Usa `fetchRequestHandler` (adapter fetch/Web standard) — NÃO o `nextApiHandler` do Pages Router
- `endpoint: "/api/trpc"` deve bater com o path do `httpBatchLink` no client
- `createContext` passa `req.headers` — mesmo shape que o RSC caller

---

## Padrões de uso

### A. Prefetch em Server Component (recomendado)

```tsx
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { LeaderboardClient } from "./leaderboard-client";

export default async function LeaderboardPage() {
  prefetch(trpc.roast.leaderboard.queryOptions({ limit: 50 }));

  return (
    <HydrateClient>
      <LeaderboardClient />
    </HydrateClient>
  );
}
```

- `prefetch` é fire-and-forget (`void`) — não bloqueia renderização
- Dados chegam via streaming; `useQuery` retorna `undefined` até hidratar

### B. Fetch síncrono (quando precisa dos dados no RSC + client)

```tsx
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { ClientGreeting } from "./client-greeting";

export default async function Home() {
  const queryClient = getQueryClient();
  const greeting = await queryClient.fetchQuery(trpc.hello.queryOptions());

  // Use greeting no server para SEO, metadata, etc.
  return (
    <HydrateClient>
      <ClientGreeting />
    </HydrateClient>
  );
}
```

- `fetchQuery` await — bloqueia até ter os dados (mais lento para TTFB)
- Dados ficam no QueryClient e são hidratados para o client
- **Tradeoff:** page só renderiza após query completar (sem streaming)

### C. Server-side call (sem hidratar para o client)

```tsx
import { caller } from "@/trpc/server";

export default async function Page({ params }: { params: { slug: string } }) {
  const roast = await caller.roast.bySlug({ slug: params.slug });

  return <h1>Score: {roast.score}/10</h1>;
}
```

- `caller` executa procedures no server sem HTTP
- Dados NÃO vão para o QueryClient do client — puramente server-side
- Ideal para: metadata, SEO, rendering estático

### D. useQuery em Client Component

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function LeaderboardClient() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.roast.leaderboard.queryOptions({ limit: 50 }),
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return <ul>{data.map((item) => <li key={item.slug}>{item.score}</li>)}</ul>;
}
```

### E. useSuspenseQuery (com Suspense boundary)

```tsx
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function LeaderboardClient() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.roast.leaderboard.queryOptions({ limit: 50 }),
  );

  // data nunca é undefined — Suspense garante
  return <ul>{data.map((item) => <li key={item.slug}>{item.score}</li>)}</ul>;
}
```

```tsx
// Server Component pai:
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { LeaderboardClient } from "./leaderboard-client";

export default async function Page() {
  prefetch(trpc.roast.leaderboard.queryOptions({}));

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <LeaderboardClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
```

### F. Mutation com invalidação de cache

```tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function SubmitForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createSubmission = useMutation(
    trpc.submission.create.mutationOptions({
      onSuccess: () => {
        // Invalida leaderboard após novo roast
        queryClient.invalidateQueries({
          queryKey: trpc.roast.leaderboard.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.stats.global.queryKey(),
        });
      },
    }),
  );

  return (
    <button
      disabled={createSubmission.isPending}
      onClick={() =>
        createSubmission.mutate({
          sourceCode: "const x = 1;",
          language: "javascript",
          lineCount: 1,
        })
      }
    >
      {createSubmission.isPending ? "Submitting..." : "Submit"}
    </button>
  );
}
```

**Cache invalidation** — após mutation que altera dados, invalidar queries relacionadas:
- `trpc.xxx.queryKey()` retorna a key tipada — sem strings mágicas

### G. Prefetch paralelo

```tsx
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function HomePage() {
  prefetch(trpc.roast.leaderboard.queryOptions({ limit: 10 }));
  prefetch(trpc.stats.global.queryOptions());

  return (
    <HydrateClient>
      {/* múltiplos Client Components consumem os dados */}
    </HydrateClient>
  );
}
```

- Múltiplos `prefetch` em paralelo — não dependem um do outro
- Todos hidratam em um único `<HydrationBoundary>`

---

## Integração com layout.tsx

```tsx
import type { Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/client";
import { NavbarNavigation } from "@/components/navbar-navigation";
import { Navbar, NavbarLogo } from "@/components/ui/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "devroast — paste your code. get roasted.",
  description:
    "Drop your code below and we'll rate it — brutally honest or full roast mode.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-bg-page font-sans text-text-primary">
        <TRPCReactProvider>
          <Navbar>
            <NavbarLogo />
            <NavbarNavigation />
          </Navbar>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
```

- `TRPCReactProvider` envolve **tudo** — Navbar e children
- O `QueryClientProvider` interno garante que hooks funcionem em qualquer componente

---

## Error Handling

### No server (procedures)

```ts
import { TRPCError } from "@trpc/server";

throw new TRPCError({
  code: "NOT_FOUND",
  message: "Roast not found",
});

throw new TRPCError({
  code: "BAD_REQUEST",
  message: "Invalid language",
  cause: originalError, // opcional — preserva stack trace
});
```

### No client (hooks)

```tsx
const { error } = useQuery(trpc.roast.bySlug.queryOptions({ slug: "abc" }));

if (error) {
  // error é TRPCError com:
  // - error.code: "NOT_FOUND", "BAD_REQUEST", etc.
  // - error.message: mensagem legível
  // - error.data.httpStatus: 404, 400, etc.
}
```

### Códigos de erro relevantes

| Código | HTTP | Uso neste projeto |
|--------|------|-------------------|
| `BAD_REQUEST` | 400 | Input inválido (Zod falhou) |
| `NOT_FOUND` | 404 | Roast/slug não existe |
| `INTERNAL_SERVER_ERROR` | 500 | Erro do Drizzle, DB indisponível |

---

## Decisões de design

| Decisão | Escolha | Por quê |
|---------|---------|---------|
| `server-only` / `client-only` | Sim | Previne import acidental que vaze server code para o client |
| SuperJSON transformer | Não por enquanto | Nossos dados são primitives + JSON — sem `Date`/`Map`/`Set` customizados |
| `httpBatchLink` | Sim | Agrupa requests paralelos em um único HTTP call |
| `refetchOnWindowFocus` | `false` | Evita requests desnecessários em app anônimo |
| `staleTime` 30s | Sim | Balanceia frescura com performance após SSR |
| `fetchQuery` vs `prefetch` | `prefetch` por padrão | Não bloqueia TTFB; streaming habilitado |
| Caller para RSC | Sim | Dados server-side sem overhead de HTTP |

---

## To-Dos

### Instalação

- [ ] `pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod server-only client-only`

### Core — criar arquivos base

- [ ] Criar `src/trpc/init.ts` — `createTRPCContext`, `baseProcedure`, `loggedProcedure`
- [ ] Criar `src/trpc/query-client.ts` — `makeQueryClient` com defaults de SSR
- [ ] Criar `src/trpc/client.tsx` — `TRPCProvider`, `useTRPC`, `getQueryClient`
- [ ] Criar `src/trpc/server.ts` — `trpc` proxy, `caller`, `prefetch`, `HydrateClient`

### Routers

- [ ] Criar `src/trpc/routers/_app.ts` — root router + `AppRouter` type
- [ ] Criar `src/trpc/routers/submission.ts` — `create` mutation com validação Zod
- [ ] Criar `src/trpc/routers/roast.ts` — `bySlug` query + `leaderboard` query
- [ ] Criar `src/trpc/routers/stats.ts` — `global` query

### HTTP Adapter

- [ ] Criar `app/api/trpc/[trpc]/route.ts` — `fetchRequestHandler` com GET + POST

### Integração com app existente

- [ ] Atualizar `app/layout.tsx` — envolver com `TRPCReactProvider`
- [ ] Verificar se Navbar/children precisam de ajustes com o provider

### Validação

- [ ] Rodar `pnpm lint` (Biome)
- [ ] Rodar `pnpm build` — garantir sem erros de type/import
- [ ] Testar manualmente: `/api/trpc` no browser deve retornar erro de tRPC (não 404)

### Migrations futuras (fora do escopo desta spec)

- [ ] Migrar pages existentes para `prefetch` + hooks
- [ ] Adicionar error boundaries globais
- [ ] Considerar server actions para mutations que precisam de progressive enhancement
