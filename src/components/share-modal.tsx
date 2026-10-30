"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ShareModalProps {
  slug: string;
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ slug, open, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const ogImageUrl = `/roast/${slug}/og`;
  const fullOgUrl = `/roast/${slug}/og`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullOgUrl);
    } catch {
      const input = document.createElement("input");
      input.value = fullOgUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fullOgUrl]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 outline-none"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-lg border border-border-primary bg-bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-lg font-bold text-text-primary">
            share roast
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-text-tertiary transition-colors hover:text-text-primary"
            aria-label="Close share modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* OG Image Preview */}
        <a
          href={ogImageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 block overflow-hidden rounded border border-border-primary cursor-pointer"
        >
          <img
            src={ogImageUrl}
            alt="Roast preview"
            className="w-full"
            loading="eager"
          />
        </a>

        {/* URL + Copy */}
        <div className="flex items-center gap-2">
          <div className="flex-1 overflow-hidden rounded border border-border-primary bg-bg-page px-3 py-2 font-mono text-xs text-text-secondary truncate">
            {ogImageUrl}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded border border-border-primary bg-bg-surface px-4 py-2 font-mono text-sm text-text-secondary transition-colors hover:border-accent-green hover:text-accent-green"
          >
            {copied ? "copied!" : "copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}
