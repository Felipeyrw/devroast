# Spec 001 — Drizzle ORM + Postgres (Docker Compose)

> **Nota:** Esta spec foi originalmente escrita antes da implementação do editor de código. A seção "Detecção de Linguagem" abaixo descreve o comportamento atual.

## Contexto

DevRoast persiste submissões de código anônimas, roasts gerados pelo Groq e issues identificados. Sem autenticação. Leaderboard global simples.

**Stack:** Next.js 16 · Drizzle ORM · PostgreSQL 16 (Docker) · Groq API · highlight.js

---

## Enums (derivados do layout)

| Nome no DB | Valores | Referência no design |
|------------|---------|----------------------|
| `programming_language` | `javascript` `typescript` `python` `java` `c` `cpp` `csharp` `go` `rust` `ruby` `php` `swift` `kotlin` `sql` `html` `css` `other` | Leaderboard rows: `javascript`, `typescript`, `sql`, `java` |
| `verdict` | `needs_serious_help` `mediocre` `acceptable` `good_job` `chefs_kiss` | Badge na Screen 2: `needs_serious_help` |
| `issue_severity` | `critical` `warning` `good` | Issue cards: `critical` (red), `warning` (amber), `good` (green) |

> `issue_severity` usa `good` em vez de `info`/`positive` — o layout mostra apenas `critical`, `warning`, `good` nos cards de análise.

---

## Tabelas

### 1. `submissions`

Campo do editor na **Screen 1 — Code Input**.

```
submissions
├── id              uuid        PK  default gen_random_uuid()
├── source_code     text        NOT NULL          ← editor de código
├── language        programming_language NOT NULL  ← linguagem selecionada/detectada
├── line_count      integer     NOT NULL          ← "7 lines" na Screen 2
├── roast_mode      boolean     NOT NULL default false  ← toggle "maximum sarcasm"
├── created_at      timestamp   NOT NULL default now()
```

### 2. `roasts`

Resultado da análise — **Screen 2 — Roast Results** e **Screen 4 — OG Image**.

```
roasts
├── id              uuid        PK  default gen_random_uuid()
├── slug            varchar(12) NOT NULL UNIQUE   ← URL pública /roast/{slug}
├── submission_id   uuid        NOT NULL FK → submissions.id ON DELETE CASCADE
├── score           numeric(3,1) NOT NULL CHECK (score >= 0 AND score <= 10)  ← "3.5/10"
├── verdict         verdict     NOT NULL          ← badge "needs_serious_help"
├── roast_quote     text        NOT NULL          ← frase de efeito
├── improved_code   text        NULL              ← bloco de diff (suggested_fix)
├── raw_response    jsonb       NOT NULL          ← resposta bruta do Groq
├── created_at      timestamp   NOT NULL default now()
```

### 3. `issues`

Cards de análise — **Screen 2 — Issues Grid** (4 cards por roast).

```
issues
├── id              uuid        PK  default gen_random_uuid()
├── roast_id        uuid        NOT NULL FK → roasts.id ON DELETE CASCADE
├── severity        issue_severity NOT NULL       ← dot color: red/amber/green
├── title           varchar(255) NOT NULL          ← "using var instead of const/let"
├── description     text        NOT NULL          ← explicação detalhada
├── sort_order      integer     NOT NULL default 0 ← ordem de exibição
├── created_at      timestamp   NOT NULL default now()
```

---

## Relacionamentos

```
submissions 1 ──── 1 roasts 1 ──── N issues
```

Ambos com `ON DELETE CASCADE`.

---

## Índices

| Tabela | Coluna(s) | Justificativa |
|--------|-----------|---------------|
| `roasts` | `score` ASC | Leaderboard: piores notas primeiro |
| `roasts` | `submission_id` | Join com submissions |
| `issues` | `roast_id` | Query de issues por roast |

---

## Queries de referência (como o frontend consome)

### Leaderboard (Screen 3 — Shame Leaderboard)

```ts
// Ordena por score ASC (pior primeiro)
db.select({
  score: roasts.score,
  sourceCode: submissions.sourceCode,
  language: submissions.language,
  lineCount: submissions.lineCount,
  createdAt: submissions.createdAt,
})
.from(roasts)
.innerJoin(submissions, eq(submissions.id, roasts.submissionId))
.orderBy(asc(roasts.score))
.limit(50)
```

### Resultado do roast (Screen 2)

```ts
// Roast + submission + issues
db.query.roasts.findFirst({
  where: eq(roasts.id, roastId),
  with: {
    submission: true,
    issues: { orderBy: asc(issues.sortOrder) },
  },
})
```

### Estatísticas globais (footer "2,847 codes roasted · avg score: 4.2/10")

```ts
db.select({
  total: count(),
  avgScore: avg(roasts.score),
}).from(roasts)
```

---

## Detecção de Linguagem (Editor de Código — Screen 1)

### Comportamento

A detecção de linguagem ocorre **automaticamente em tempo real** conforme o usuário digita no editor, sem necessidade de clicar em nenhum botão.

| Aspecto | Detalhe |
|---------|---------|
| **Biblioteca** | `highlight.js` (`hljs.highlightAuto`) |
| **Timing** | Debounce de 400ms após última digitação |
| **Escopo** | Sincronizado com o highlighting (shiki) — ambos usam a mesma linguagem detectada |
| **Override** | LanguagePicker aparece no header do editor após detecção, permitindo troca manual |
| **Fallback** | `javascript` quando código vazio ou linguagem não suportada |

### Linguagens suportadas (UI)

`javascript` · `typescript` · `python` · `rust` · `go` · `sql` · `html` · `css` · `java` · `bash` · `json`

### Fluxo

```
Usuário digita código
         |
         v
Debounce 400ms (resetado a cada tecla)
         |
         v
hljs.highlightAuto(code) → linguagem detectada
         |
         v
LanguagePicker exibido no header (com linguagem detectada)
HighlightedCode (shiki) renderiza com a linguagem detectada
         |
         v
Usuário pode alterar via LanguagePicker (opcional)
         |
         v
Clique em "roast_my_code" → onSubmit(code, language)
```

### Botão "roast_my_code"

Botão primary com hover effect sutil — `brightness-90` no hover escurece levemente o verde accent. Não altera opacidade. O botão apenas dispara o `onSubmit` com o código e linguagem atual; a detecção já foi feita em tempo real.

---

## To-Dos

### Docker Compose

- [ ] Criar `docker-compose.yml` com Postgres 16
- [ ] Volume persistente `pgdata:/var/lib/postgresql/data`
- [ ] Healthcheck para aguardar o banco subir
- [ ] Criar `.env.example` com `DATABASE_URL`
- [ ] Adicionar `.env` ao `.gitignore`

### Drizzle ORM — Setup

- [ ] `pnpm add drizzle-orm postgres`
- [ ] `pnpm add -D drizzle-kit`
- [ ] Criar `drizzle.config.ts` na raiz
- [ ] Criar `src/db/index.ts` — conexão com `postgres()` e `drizzle()`

### Drizzle ORM — Schema

- [ ] Criar `src/db/schema.ts` contendo:
  - [ ] `pgEnum('programming_language', [...])`
  - [ ] `pgEnum('verdict', [...])`
  - [ ] `pgEnum('issue_severity', [...])`
  - [ ] `pgTable('submissions', {...})`
  - [ ] `pgTable('roasts', {...})`
  - [ ] `pgTable('issues', {...})`
  - [ ] `relations()` para os 3 relacionamentos

### Drizzle ORM — Migrations

- [ ] Adicionar scripts ao `package.json`:
  ```json
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
  ```
- [ ] `pnpm db:generate` — gerar migration inicial
- [ ] `pnpm db:migrate` — rodar migration

### Drizzle ORM — Queries

- [ ] Criar `src/db/queries.ts` com:
  - [ ] `createSubmission(data)` — insert + return id
  - [ ] `createRoast(submissionId, data, issues)` — insert roast + issues em transaction
  - [ ] `getLeaderboard(limit)` — join submissions + roasts, order by score ASC
  - [ ] `getRoastWithDetails(roastId)` — roasts + submission + issues
  - [ ] `getGlobalStats()` — count + avg score

---

## Estrutura de arquivos

```
.
├── docker-compose.yml
├── .env
├── .env.example
├── drizzle.config.ts
├── drizzle/
│   └── 0000_initial.sql
└── src/
    └── db/
        ├── index.ts          # conexão
        ├── schema.ts         # enums, tabelas, relations
        └── queries.ts        # funções helper
```
