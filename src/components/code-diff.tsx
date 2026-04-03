"use client";

import { diffLines } from "diff";
import { useMemo } from "react";
import { DiffLine } from "@/components/ui/diff-line";

interface CodeDiffProps {
  original: string;
  improved: string;
  language?: string;
}

export function CodeDiff({ original, improved }: CodeDiffProps) {
  const changes = useMemo(
    () => diffLines(original, improved),
    [original, improved],
  );

  return (
    <div className="overflow-hidden rounded border border-border-primary bg-bg-input">
      {changes.map((part, i) => {
        const lines = part.value.replace(/\n$/, "").split("\n");
        return lines.map((line, j) => (
          <DiffLine
            // biome-ignore lint/suspicious/noArrayIndexKey: diff parts are stable
            key={`${i}-${j}`}
            type={part.added ? "added" : part.removed ? "removed" : "context"}
            content={line}
          />
        ));
      })}
    </div>
  );
}
