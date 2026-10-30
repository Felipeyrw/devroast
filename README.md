# DevRoast

[Português](README.md) | [English](README.en.md)

Cole um trecho de código, receba uma avaliação de **0 a 10** e descubra o que pode melhorar — com feedback construtivo ou em modo roast.

![Página inicial do DevRoast, com editor de código e modo roast](assets/devRoast_getRoasted.png)

## Como funciona

1. Cole seu código no editor. A linguagem é detectada automaticamente e pode ser ajustada.
2. O modo roast vem ativado por padrão e deixa os comentários mais ácidos.
3. Clique em `roast_my_code` para analisar o trecho.
4. Consulte a nota, os problemas encontrados e uma sugestão de código melhorado.
5. Compartilhe o resultado ou veja como ele se compara no ranking.

O editor aceita até **2.000 caracteres** por análise.

## O que você encontra

- **Análise de código com IA:** nota, veredito, comentário e problemas categorizados por severidade.
- **Sugestões práticas:** comparação visual entre o código enviado e uma versão melhorada.
- **Resultados compartilháveis:** cada análise tem uma página própria.
- **Shame Leaderboard:** ranking dos códigos com as menores notas, com filtros por período.
- **Métricas da comunidade:** total de códigos analisados e nota média.

### Resultado da análise

A página do resultado reúne a nota, o trecho enviado, os problemas encontrados e as melhorias sugeridas.

![Resumo do resultado e código enviado](assets/devRoast_roast1.png)

![Problemas encontrados durante a análise](assets/devRoast_roast2.png)

![Comparação entre o código enviado e a versão melhorada](assets/devRoast_roast3.png)

### Ranking da comunidade

Veja os códigos com as menores notas e filtre os resultados entre todo o período e este mês.

![Shame Leaderboard do DevRoast](assets/devRoast_leaderboard.png)

## Páginas

| Caminho | Descrição |
| --- | --- |
| `/` | Editor, métricas e prévia do ranking |
| `/roast/[slug]` | Resultado, análise e sugestões de melhoria |
| `/leaderboard` | Ranking completo, com filtros por período |
| `/examples` | Exemplos dos componentes da interface |

## Tecnologias

- [Next.js](https://nextjs.org/) 16 e React 19
- TypeScript e Tailwind CSS 4
- tRPC e TanStack Query
- PostgreSQL e Drizzle ORM
- Groq para análise de código
- Shiki e Highlight.js para realce de sintaxe

## Executar localmente

### Pré-requisitos

- Node.js compatível com Next.js 16
- [pnpm](https://pnpm.io/)
- [Docker Compose](https://docs.docker.com/compose/)
- Uma chave de API da [Groq](https://console.groq.com/)

### Configuração

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Crie um arquivo `.env.local` na raiz do projeto:

   ```dotenv
   DATABASE_URL=postgres://devroast:devroast@localhost:5432/devroast
   GROQ_API_KEY=sua_chave_da_groq
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Inicie o PostgreSQL:

   ```bash
   docker compose up -d
   ```

4. Disponibilize `DATABASE_URL` no ambiente do terminal e aplique as migrations:

   ```bash
   export DATABASE_URL="postgres://devroast:devroast@localhost:5432/devroast"
   pnpm db:migrate
   ```

   No PowerShell, use `$env:DATABASE_URL = "postgres://devroast:devroast@localhost:5432/devroast"` antes de executar `pnpm db:migrate`.

5. Inicie a aplicação:

   ```bash
   pnpm dev
   ```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Gera a build de produção |
| `pnpm start` | Inicia a aplicação em produção |
| `pnpm lint` | Verifica o código com Biome |
| `pnpm db:generate` | Gera migrations a partir do schema |
| `pnpm db:migrate` | Aplica migrations pendentes |
| `pnpm db:push` | Sincroniza o schema diretamente (desenvolvimento) |
| `pnpm db:studio` | Abre o Drizzle Studio |
| `pnpm db:seed` | Popula o banco com dados de exemplo (lê o arquivo `.env`) |

## Privacidade

O código enviado é encaminhado à Groq para análise e armazenado no PostgreSQL junto ao resultado. Envie apenas trechos que você tem autorização para compartilhar; evite incluir credenciais, tokens ou outros dados sensíveis.
