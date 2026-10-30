# DevRoast

[Português](README.md) | [English](README.en.md)

Paste a code snippet, get a score from **0 to 10**, and find out what you can improve—with constructive feedback or a full roast.

![DevRoast homepage with the code editor and roast mode](assets/devRoast_getRoasted.png)

## How it works

1. Paste your code into the editor. Its language is detected automatically and can be changed.
2. Roast mode is enabled by default and makes the comments more sarcastic.
3. Click `roast_my_code` to analyze your snippet.
4. Review your score, the issues found, and suggested improvements.
5. Share your result or see how it ranks against other submissions.

The editor accepts up to **2,000 characters** per analysis.

## Features

- **AI-powered code analysis:** a score, verdict, comment, and issues categorized by severity.
- **Practical suggestions:** a visual comparison of your submitted code and an improved version.
- **Shareable results:** each analysis has its own page.
- **Shame Leaderboard:** a ranking of the lowest-scoring submissions, filterable by time period.
- **Community metrics:** the total number of analyzed snippets and the average score.

### Analysis results

The results page brings together your score, submitted snippet, detected issues, and suggested improvements.

![Analysis summary and submitted code](assets/devRoast_roast1.png)

![Issues found during the analysis](assets/devRoast_roast2.png)

![Comparison between the submitted code and the improved version](assets/devRoast_roast3.png)

### Community leaderboard

Browse the lowest-scoring submissions and filter results by all time or this month.

![DevRoast Shame Leaderboard](assets/devRoast_leaderboard.png)

## Pages

| Path | Description |
| --- | --- |
| `/` | Editor, metrics, and leaderboard preview |
| `/roast/[slug]` | Result, analysis, and improvement suggestions |
| `/leaderboard` | Full ranking with time-period filters |
| `/examples` | UI component examples |

## Tech stack

- [Next.js](https://nextjs.org/) 16 and React 19
- TypeScript and Tailwind CSS 4
- tRPC and TanStack Query
- PostgreSQL and Drizzle ORM
- Groq for code analysis
- Shiki and Highlight.js for syntax highlighting

## Run locally

### Prerequisites

- A version of Node.js compatible with Next.js 16
- [pnpm](https://pnpm.io/)
- [Docker Compose](https://docs.docker.com/compose/)
- A [Groq](https://console.groq.com/) API key

### Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the project root:

   ```dotenv
   DATABASE_URL=postgres://devroast:devroast@localhost:5432/devroast
   GROQ_API_KEY=your_groq_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

4. Make `DATABASE_URL` available in your terminal environment and run the migrations:

   ```bash
   export DATABASE_URL="postgres://devroast:devroast@localhost:5432/devroast"
   pnpm db:migrate
   ```

   In PowerShell, run `$env:DATABASE_URL = "postgres://devroast:devroast@localhost:5432/devroast"` before `pnpm db:migrate`.

5. Start the app:

   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production app |
| `pnpm lint` | Check the code with Biome |
| `pnpm db:generate` | Generate migrations from the schema |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:push` | Push the schema directly (development only) |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Seed the database with sample data (reads `.env`) |

## Privacy

Submitted code is sent to Groq for analysis and stored in PostgreSQL along with the result. Only submit snippets you are authorized to share, and avoid including credentials, tokens, or other sensitive data.
