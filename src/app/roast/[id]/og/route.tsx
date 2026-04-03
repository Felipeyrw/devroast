import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "@takumi-rs/image-response";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { getRoastBySlug } from "@/db/queries";

const getCachedRoast = unstable_cache(
  async (slug: string) => getRoastBySlug(slug),
  ["roast-og"],
  { revalidate: 3600, tags: ["roast-og"] },
);

let fontBuffer: Buffer | undefined;

async function getFont() {
  if (!fontBuffer) {
    fontBuffer = await readFile(
      join(process.cwd(), "public/fonts/JetBrainsMono-Regular.woff2"),
    );
  }
  return fontBuffer;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const roast = await getCachedRoast(id);

  if (!roast) {
    notFound();
  }

  const score = Number(roast.score);
  const scoreColor = score < 4 ? "#EF4444" : score < 7 ? "#F59E0B" : "#10B981";
  const verdictColor = scoreColor;

  const font = await getFont();

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0C0C0C",
        padding: 64,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "JetBrains Mono",
        gap: 28,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 700, color: "#10B981" }}>
          &gt;
        </span>
        <span style={{ fontSize: 20, fontWeight: 500, color: "#E5E5E5" }}>
          devroast
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: scoreColor,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontSize: 56,
            fontWeight: 400,
            color: "#525252",
            lineHeight: 1,
          }}
        >
          /10
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: verdictColor,
          }}
        />
        <span style={{ fontSize: 20, fontWeight: 400, color: verdictColor }}>
          {roast.verdict}
        </span>
      </div>

      <span style={{ fontSize: 16, fontWeight: 400, color: "#525252" }}>
        lang: {roast.language} · {roast.lineCount} lines
      </span>

      <span
        style={{
          fontSize: 22,
          fontWeight: 400,
          color: "#E5E5E5",
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 800,
        }}
      >
        "{roast.roastQuote}"
      </span>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "JetBrains Mono",
          data: font.buffer as ArrayBuffer,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
