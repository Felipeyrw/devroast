import { faker } from "@faker-js/faker";
import { db } from "./index";
import { issues, roasts, submissions } from "./schema";

// ── Constants ──────────────────────────────────────────────────────────

const TOTAL = 100;

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "sql",
  "html",
  "css",
] as const;

const VERDICTS = [
  "needs_serious_help",
  "needs_serious_help",
  "needs_serious_help",
  "mediocre",
  "mediocre",
  "mediocre",
  "acceptable",
  "acceptable",
  "good_job",
  "chefs_kiss",
] as const;

const SEVERITIES = [
  "critical",
  "critical",
  "warning",
  "warning",
  "good",
] as const;

// ── Code snippets by language ──────────────────────────────────────────

const CODE_SNIPPETS: Record<string, string[]> = {
  javascript: [
    `function calculateTotal(items) {\n  var total = 0;\n  for (var i = 0; i < items.length; i++) {\n    total = total + items[i].price;\n  }\n  return total;\n}`,
    `var data = eval(prompt("enter code"));\nif (data == true) {\n  document.write(response);\n}\n// trust the user lol`,
    `function fetch(url) {\n  var xhr = new XMLHttpRequest();\n  xhr.open("GET", url, false);\n  xhr.send();\n  return JSON.parse(xhr.responseText);\n}`,
    `var arr = [1,2,3,4,5];\nfor (var i=0; i<arr.length; i++) {\n  console.log(arr[i]);\n}\n// TODO: make this better later`,
    `window.onload = function() {\n  document.getElementById("btn").onclick = function() {\n    alert("clicked!");\n  };\n};`,
  ],
  typescript: [
    `function process(data: any): any {\n  if (data == true) { return true; }\n  else if (data == false) { return false; }\n  else { return !false; }\n}`,
    `const handleRequest = (req: any, res: any) => {\n  let result: any = {};\n  try {\n    result = JSON.parse(req.body);\n  } catch(e) {}\n  res.send(result);\n};`,
    `type User = any;\nfunction getUser(id: string): User {\n  const user: any = fetchUser(id);\n  return user as User;\n}`,
    `interface Config {}\nconst config: any = {\n  debug: true,\n  port: 3000,\n  secret: "password123"\n};`,
  ],
  python: [
    `def process_data(data):\n    result = []\n    for i in range(len(data)):\n        if data[i] != None:\n            result.append(data[i])\n    return result`,
    `import *\nfrom os import *\nimport sys\n\ndef main():\n    x = eval(input("Enter: "))\n    print(x)`,
    `class User:\n    def __init__(self, name, email, password):\n        self.name = name\n        self.email = email\n        self.password = password\n    def save(self):\n        print(f"Saving {self.password} to db")`,
    `def calculate(a, b):\n    if a > 0:\n        if b > 0:\n            if a > b:\n                return a\n            else:\n                return b\n        else:\n            return a\n    else:\n        return 0`,
  ],
  java: [
    `public class Main {\n  public static void main(String[] args) {\n    String s = null;\n    System.out.println(s.toString());\n  }\n}`,
    `public int process(int[] arr) {\n  int sum = 0;\n  for (int i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}`,
    `public class Utils {\n  public static String getPassword() {\n    return "admin123";\n  }\n  public static void log(String secret) {\n    System.out.println(secret);\n  }\n}`,
  ],
  go: [
    `func process(data []byte) error {\n  if data == nil {\n    return nil\n  }\n  fmt.Println(string(data))\n  return nil\n}`,
    `var db *sql.DB\n\nfunc getUser(id int) (*User, error) {\n  row := db.QueryRow("SELECT * FROM users WHERE id = " + string(id))\n  var u User\n  row.Scan(&u.Name)\n  return &u, nil\n}`,
  ],
  rust: [
    `fn process(data: &str) -> String {\n  let result = String::new();\n  for c in data.chars() {\n    result.push(c);\n  }\n  result\n}`,
    `fn main() {\n  let s = String::from("hello");\n  let s2 = s;\n  println!("{}", s);\n}`,
  ],
  sql: [
    `SELECT * FROM users WHERE 1=1\n-- TODO: add authentication\nORDER BY RAND()\nLIMIT 999999;`,
    `DELETE FROM orders\nWHERE status = 'pending'\n-- no backup, yolo`,
    `SELECT u.name, COUNT(o.id)\nFROM users u, orders o\nWHERE u.id = o.user_id\nGROUP BY u.name\nHAVING COUNT(o.id) > 0;`,
  ],
  html: [
    `<div onclick="alert('hi')">Click me</div>\n<style>body { font-size: 2px; }</style>\n<script>eval(location.hash.slice(1))</script>`,
    `<table>\n<tr><td>Name</td><td>Age</td></tr>\n<tr><td>John</td><td>25</td></tr>\n</table>\n<center><blink>Welcome!</blink></center>`,
  ],
  css: [
    `body { color: red !important; }\n* { margin: 0 !important; padding: 0 !important; }\n#btn { font-size: 48px; position: absolute; top: 0; left: 0; }`,
    `.container { width: 10000px; height: 10000px; }\n.text { font-family: Comic Sans MS; color: lime; background: magenta; }`,
  ],
};

// ── Issue templates ────────────────────────────────────────────────────

const ISSUE_TEMPLATES = {
  critical: [
    {
      title: "eval() usage detected",
      desc: "Using eval() is a major security vulnerability. Never evaluate user input as code.",
    },
    {
      title: "SQL injection vulnerability",
      desc: "String concatenation in SQL queries allows attackers to inject arbitrary SQL.",
    },
    {
      title: "Hardcoded credentials",
      desc: "Passwords and secrets in source code will end up in version control. Use env vars.",
    },
    {
      title: "Synchronous I/O blocking",
      desc: "Blocking the main thread with synchronous file/network operations freezes the UI.",
    },
    {
      title: "Null pointer dereference",
      desc: "This will throw a NullPointerException at runtime. Add a null check.",
    },
    {
      title: "Buffer overflow risk",
      desc: "Writing past array bounds causes undefined behavior and potential security exploits.",
    },
    {
      title: "Infinite loop potential",
      desc: "Loop condition can never become false, causing the program to hang indefinitely.",
    },
  ],
  warning: [
    {
      title: "Using var instead of const/let",
      desc: "var is function-scoped and leads to hoisting bugs. Use const by default, let when reassignment is needed.",
    },
    {
      title: "Imperative loop pattern",
      desc: "for loops are verbose and error-prone. Use .reduce() or .map() for cleaner transformations.",
    },
    {
      title: "Loose equality operator",
      desc: "== performs type coercion in unexpected ways. Always use === for strict comparison.",
    },
    {
      title: "Magic numbers in code",
      desc: "Unnamed numeric literals make code hard to understand. Extract to named constants.",
    },
    {
      title: "Missing error handling",
      desc: "Errors are silently swallowed. At minimum, log the error for debugging.",
    },
    {
      title: "No input validation",
      desc: "User input is used directly without sanitization. Validate before processing.",
    },
    {
      title: "God function detected",
      desc: "This function does too many things. Split into smaller, focused functions.",
    },
    {
      title: "Mutable global state",
      desc: "Global variables create hidden dependencies and make testing impossible.",
    },
  ],
  good: [
    {
      title: "Clear naming conventions",
      desc: "Function and variable names are descriptive and communicate intent without comments.",
    },
    {
      title: "Single responsibility",
      desc: "The function does one thing well with no side effects or mixed concerns.",
    },
    {
      title: "Proper error propagation",
      desc: "Errors are returned to the caller instead of being silently ignored.",
    },
    {
      title: "Consistent formatting",
      desc: "Code follows a consistent style guide, making it easy to read and maintain.",
    },
    {
      title: "Type safety maintained",
      desc: "Types are properly defined without resorting to any or unknown.",
    },
  ],
};

// ── Roast quotes ───────────────────────────────────────────────────────

const ROAST_QUOTES = [
  "this code looks like it was written during a power outage... in 2005.",
  "i've seen better code written by a cat walking on a keyboard.",
  "this is what happens when you skip the tutorial and go straight to production.",
  "the only thing this code roasts is my will to live.",
  "even Stack Overflow couldn't save this one.",
  "this code has more red flags than a communist parade.",
  "i showed this to my therapist. she started crying.",
  "this code is the reason AI was invented — to replace developers who write like this.",
  "congratulations, you've invented a new way to write bad code.",
  "if this code were a movie, it would be a 0% on Rotten Tomatoes.",
  "this code is so legacy, it came with a fax machine.",
  "i ran this through a linter. the linter quit its job.",
  "this code has more issues than a magazine subscription.",
  "the only thing clean about this code is how cleanly it would fail in production.",
  "i've seen spaghetti with more structure than this code.",
  "this code is proof that copy-paste is not a design pattern.",
  "your variable naming convention is 'chaotic neutral'.",
  "this code doesn't have bugs. it has features nobody asked for.",
  "i tried to refactor this. the code fought back.",
  "this is the coding equivalent of microwaving a salad.",
];

// ── Helpers ────────────────────────────────────────────────────────────

const SLUG_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

function generateSlug(length = 8): string {
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += SLUG_CHARS[Math.floor(Math.random() * SLUG_CHARS.length)];
  }
  return slug;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scoreToVerdict(score: number): (typeof VERDICTS)[number] {
  if (score <= 2) return "needs_serious_help";
  if (score <= 4) return "mediocre";
  if (score <= 6) return "acceptable";
  if (score <= 8) return "good_job";
  return "chefs_kiss";
}

// ── Main ───────────────────────────────────────────────────────────────

async function seed() {
  console.log(`🌱 Seeding ${TOTAL} roasts...\n`);

  // Clean tables in FK order
  await db.delete(issues);
  await db.delete(roasts);
  await db.delete(submissions);
  console.log("  Tables truncated.\n");

  const slugSet = new Set<string>();

  for (let i = 0; i < TOTAL; i++) {
    const language = pick(LANGUAGES);
    const snippets = CODE_SNIPPETS[language] ?? CODE_SNIPPETS.javascript;
    const code = pick(snippets);
    const lineCount = code.split("\n").length;
    const scoreNum = faker.number.float({
      min: 0.5,
      max: 9.8,
      fractionDigits: 1,
    });
    const verdict = scoreToVerdict(scoreNum);

    // Generate unique slug
    let slug = generateSlug();
    while (slugSet.has(slug)) slug = generateSlug();
    slugSet.add(slug);

    // Insert submission
    const [sub] = await db
      .insert(submissions)
      .values({
        sourceCode: code,
        language,
        lineCount,
        roastMode: faker.datatype.boolean({ probability: 0.6 }),
      })
      .returning({ id: submissions.id });

    // Insert roast
    const [roast] = await db
      .insert(roasts)
      .values({
        slug,
        submissionId: sub.id,
        score: scoreNum.toFixed(1),
        verdict,
        roastQuote: pick(ROAST_QUOTES),
        improvedCode: faker.datatype.boolean({ probability: 0.7 })
          ? code.replace(/var /g, "const ").replace(/==/g, "===")
          : null,
        rawResponse: {
          model: "llama-3.1-8b-instant",
          usage: { total_tokens: faker.number.int({ min: 200, max: 2000 }) },
        },
      })
      .returning({ id: roasts.id });

    // Insert issues (2-5 per roast)
    const issueCount = faker.number.int({ min: 2, max: 5 });
    const issueValues = Array.from({ length: issueCount }, (_, j) => {
      // Most issues should match the severity implied by the score
      const sevRoll = Math.random();
      let severity: (typeof SEVERITIES)[number];
      if (scoreNum <= 3) {
        severity =
          sevRoll < 0.6 ? "critical" : sevRoll < 0.85 ? "warning" : "good";
      } else if (scoreNum <= 6) {
        severity =
          sevRoll < 0.2 ? "critical" : sevRoll < 0.7 ? "warning" : "good";
      } else {
        severity =
          sevRoll < 0.1 ? "critical" : sevRoll < 0.3 ? "warning" : "good";
      }

      const template = pick(ISSUE_TEMPLATES[severity]);
      return {
        roastId: roast.id,
        severity,
        title: template.title,
        description: template.desc,
        sortOrder: j,
      };
    });

    await db.insert(issues).values(issueValues);

    if ((i + 1) % 25 === 0) {
      console.log(`  ✓ ${i + 1}/${TOTAL}`);
    }
  }

  console.log(`\n✅ Done! ${TOTAL} submissions, ${TOTAL} roasts seeded.`);

  // Show stats
  const [stats] = await db.select({ count: submissions.id }).from(submissions);

  const [roastCount] = await db.select({ count: roasts.id }).from(roasts);

  console.log(`   Submissions: ${stats ? "✓" : "✗"}`);
  console.log(`   Roasts: ${roastCount ? "✓" : "✗"}`);
  console.log(`\n   Run: pnpm db:studio`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
