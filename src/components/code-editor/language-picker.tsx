"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./detect-language";

interface LanguagePickerProps {
  value: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
}

export function LanguagePicker({ value, onChange }: LanguagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = SUPPORTED_LANGUAGES.find((l) => l.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary"
      >
        {selected?.name ?? "JavaScript"}
        <ChevronDown className="size-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded border border-border-primary bg-bg-page shadow-lg">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => {
                onChange(lang.id);
                setIsOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left font-mono text-xs transition-colors hover:bg-bg-surface ${
                lang.id === value
                  ? "text-accent-green"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
