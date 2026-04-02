"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import type { SupportedLanguage } from "./detect-language";

interface HighlightedCodeProps {
  code: string;
  language: SupportedLanguage;
  onReady?: (ready: boolean) => void;
}

export function HighlightedCode({
  code,
  language,
  onReady,
}: HighlightedCodeProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (!code.trim()) {
      setHtml("");
      onReady?.(false);
      return;
    }

    let cancelled = false;
    onReady?.(false);

    codeToHtml(code, {
      lang: language,
      theme: "vesper",
    }).then((result) => {
      if (!cancelled) {
        setHtml(result);
        onReady?.(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, language, onReady]);

  if (!html) {
    return null;
  }

  return (
    <div
      className="shiki-output px-4 py-4 font-mono text-xs leading-6"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
