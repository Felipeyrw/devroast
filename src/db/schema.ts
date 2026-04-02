import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────────────────

export const programmingLanguageEnum = pgEnum("programming_language", [
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "other",
]);

export const verdictEnum = pgEnum("verdict", [
  "needs_serious_help",
  "mediocre",
  "acceptable",
  "good_job",
  "chefs_kiss",
]);

export const issueSeverityEnum = pgEnum("issue_severity", [
  "critical",
  "warning",
  "good",
]);

// ── Tables ─────────────────────────────────────────────────────────────

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceCode: text("source_code").notNull(),
  language: programmingLanguageEnum("language").notNull(),
  lineCount: integer("line_count").notNull(),
  roastMode: boolean("roast_mode").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roasts = pgTable(
  "roasts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 12 }).notNull().unique(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    score: numeric("score", { precision: 3, scale: 1 }).notNull(),
    verdict: verdictEnum("verdict").notNull(),
    roastQuote: text("roast_quote").notNull(),
    improvedCode: text("improved_code"),
    rawResponse: jsonb("raw_response").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("roasts_score_idx").on(table.score),
    check("score_range", sql`${table.score} >= 0 AND ${table.score} <= 10`),
  ],
);

export const issues = pgTable("issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  roastId: uuid("roast_id")
    .notNull()
    .references(() => roasts.id, { onDelete: "cascade" }),
  severity: issueSeverityEnum("severity").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
