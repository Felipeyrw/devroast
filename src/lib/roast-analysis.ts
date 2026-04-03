import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
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
) => `You are a code reviewer analyzing ${language} code.

Analyze this code and return a JSON object:

\`\`\`${language}
${sourceCode}
\`\`\`

${roastMode ? `MODE: ROAST — Be brutally honest, sarcastic, and funny. Tear the code apart with wit and humor. The roastQuote should be a memorable one-liner that would make the developer cry (or laugh).` : `MODE: HONEST — Be direct and constructive. Point out real issues without being mean.`}

Return ONLY a JSON object with this exact structure (no markdown, no code blocks, no explanation):
{
  "score": 0-10,
  "verdict": "needs_serious_help" | "mediocre" | "acceptable" | "good_job" | "chefs_kiss",
  "roastQuote": "short punchy one-liner",
  "issues": [
    {"severity": "critical" | "warning" | "good", "title": "issue title", "description": "detailed description"}
  ],
  "improvedCode": "optional improved version of the code"
}`;

export async function analyzeCode(
  sourceCode: string,
  language: string,
  roastMode: boolean,
) {
  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: roastPrompt(sourceCode, language, roastMode),
    temperature: roastMode ? 0.9 : 0.3,
  });

  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  const parsed = JSON.parse(cleaned);
  return roastResponseSchema.parse(parsed);
}
