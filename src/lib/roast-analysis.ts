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
  issues: z
    .array(
      z.object({
        severity: z.enum(["critical", "warning", "good"]),
        title: z.string(),
        description: z.string(),
      }),
    )
    .min(1),
  improvedCode: z.string(),
});

const roastSystemPrompt = (
  language: string,
  roastMode: boolean,
) => `You are a world-class ${language} code reviewer with a sharp eye for bad code.

CRITICAL RULES — follow these exactly:
1. Analyze ONLY the code provided in the user message. Never reference files, imports, functions, or variables that are not visible in the snippet.
2. Do NOT complain about "missing imports" — the code may import things in other files you cannot see.
3. Do NOT say "unused import" unless the import AND its usage are both visible and the import is genuinely unused.
4. Do NOT reference external dependencies, libraries, or modules not shown in the code.
5. Be specific: quote the exact line, variable name, or pattern that is problematic.
6. Score harshly: 0-3 for truly bad code, 4-6 for mediocre, 7-8 for decent, 9-10 only for exceptional code.
7. The improvedCode must be the COMPLETE code with all fixes applied — not a partial snippet. Return the entire original code with improvements, not just the changed lines.
8. Return ONLY valid JSON. Do NOT wrap the response in markdown code blocks. Do NOT use backticks anywhere in your response.
9. You MUST return at least 1 issue in the issues array. Even good code has room for improvement.
10. You MUST return the improvedCode field with the full corrected code — never null, never empty.

${roastMode ? `ROAST MODE: Be merciless, sarcastic, and hilarious. Your roastQuote should be a devastating one-liner that haunts the developer. Think Gordon Ramsay reviewing code. Be creative, witty, and brutal.` : `HONEST MODE: Be direct, precise, and constructive. No sugar-coating but no cruelty either.`}`;

const roastUserPrompt = (
  sourceCode: string,
  language: string,
) => `Review this ${language} code:

${sourceCode}

Return ONLY a JSON object with these fields:
- score: number 0-10
- verdict: one of "needs_serious_help", "mediocre", "acceptable", "good_job", "chefs_kiss"
- roastQuote: a short one-liner about the code quality
- issues: array of objects with severity (critical/warning/good), title, and description — MUST have at least 1 issue
- improvedCode: the FULL corrected code with all improvements applied — must be a non-empty string, never null`;

function extractJson(text: string): string {
  // Try to find JSON object boundaries
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in response");
  }
  return text.slice(firstBrace, lastBrace + 1);
}

export async function analyzeCode(
  sourceCode: string,
  language: string,
  roastMode: boolean,
) {
  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    system: roastSystemPrompt(language, roastMode),
    prompt: roastUserPrompt(sourceCode, language),
    temperature: roastMode ? 1.0 : 0.2,
  });

  const jsonStr = extractJson(text);
  const parsed = JSON.parse(jsonStr);
  return roastResponseSchema.parse(parsed);
}
