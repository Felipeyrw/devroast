import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const roastResponseSchema = z.object({
  score: z.number().min(0).max(10),
  verdict: z.enum([
    "needs_serious_help",
    "mediocre",
    "acceptable",
    "good_job",
    "chefs_kiss",
  ]),
  roastQuote: z.string(),
  issues: z.array(
    z.object({
      severity: z.enum(["critical", "warning", "good"]),
      title: z.string(),
      description: z.string(),
    }),
  ),
  improvedCode: z.string().optional(),
});

const roastPrompt = (
  sourceCode: string,
  language: string,
  roastMode: boolean,
) => `
You are a code reviewer analyzing ${language} code.

Analyze this code and return a structured JSON response:

\`\`\`${language}
${sourceCode}
\`\`\`

${roastMode ? `MODE: ROAST — Be brutally honest, sarcastic, and funny. Tear the code apart with wit and humor. The roastQuote should be a memorable one-liner that would make the developer cry (or laugh).` : `MODE: HONEST — Be direct and constructive. Point out real issues without being mean.`}

Rules:
- score: 0-10 (0 = catastrophic, 10 = perfect)
- verdict: one of: needs_serious_help, mediocre, acceptable, good_job, chefs_kiss
- roastQuote: a short, punchy one-liner about the code quality
- issues: list of specific problems found (be precise)
- improvedCode: optional, only if you can meaningfully improve the code

Return ONLY valid JSON matching this schema. No markdown, no explanation.
`;

export async function analyzeCode(
  sourceCode: string,
  language: string,
  roastMode: boolean,
) {
  const { object } = await generateObject({
    model: groq("llama-3.1-8b-instant"),
    prompt: roastPrompt(sourceCode, language, roastMode),
    schema: roastResponseSchema,
  });

  return object;
}
