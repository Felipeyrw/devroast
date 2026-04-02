"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import hljs from "highlight.js";
import { useMemo } from "react";

interface CollapsibleCodeProps {
  code: string;
  language?: string;
  collapsedLines?: number;
}

function highlight(code: string, language?: string): string {
  const lang = language && hljs.getLanguage(language) ? language : undefined;
  return lang
    ? hljs.highlight(code, { language: lang }).value
    : hljs.highlightAuto(code).value;
}

export function CollapsibleCode({
  code,
  language,
  collapsedLines = 3,
}: CollapsibleCodeProps) {
  const lines = code.split("\n");
  const isCollapsible = lines.length > collapsedLines;

  const highlightedFull = useMemo(
    () => highlight(code, language),
    [code, language],
  );

  const highlightedPreview = useMemo(() => {
    if (!isCollapsible) return "";
    const preview = lines.slice(0, collapsedLines).join("\n");
    return highlight(preview, language);
  }, [isCollapsible, lines, collapsedLines, language]);

  if (!isCollapsible) {
    return <CodeContent html={highlightedFull} lines={lines} />;
  }

  return (
    <Collapsible.Root className="group rounded border border-border-primary bg-bg-input">
      <div className="relative">
        {/* Preview (collapsed state) */}
        <div className="group-data-[open]:hidden">
          <CodeContent
            html={highlightedPreview}
            lines={lines.slice(0, collapsedLines)}
          />
        </div>

        {/* Full code (expanded state) */}
        <Collapsible.Panel className="h-[300px] overflow-hidden">
          <div className="h-full overflow-auto">
            <CodeContent html={highlightedFull} lines={lines} />
          </div>
        </Collapsible.Panel>

        {/* Fade overlay on collapsed */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-bg-input to-transparent group-data-[open]:hidden" />
      </div>

      <Collapsible.Trigger className="flex w-full cursor-pointer items-center justify-center border-t border-border-primary bg-bg-surface px-4 py-2 font-mono text-xs text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary">
        <span className="group-data-[open]:hidden">
          show all {lines.length} lines {"<<"}
        </span>
        <span className="hidden group-data-[open]:inline">collapse {">>"}</span>
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}

function CodeContent({ html, lines }: { html: string; lines: string[] }) {
  return (
    <div className="flex">
      {/* Line Numbers */}
      <div className="flex w-10 shrink-0 flex-col items-end border-r border-border-primary bg-bg-surface px-2 py-3">
        {lines.map((_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are static
            key={i}
            className="font-mono text-[10px] leading-[21px] text-text-tertiary"
          >
            {i + 1}
          </span>
        ))}
      </div>

      {/* Syntax Highlighted Code */}
      <div
        className="flex-1 overflow-x-auto px-3 py-3 font-mono text-xs leading-[21px]"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: syntax highlighting from trusted source
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
