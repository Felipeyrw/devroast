"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { detectLanguage, type SupportedLanguage } from "./detect-language";
import { HighlightedCode } from "./highlighted";
import { LanguagePicker } from "./language-picker";

export const CODE_CHAR_LIMIT = 2000;

export interface CodeEditorHandle {
  submit: () => void;
}

interface CodeEditorProps {
  onSubmit?: (code: string, language: SupportedLanguage) => void;
  onLanguageDetected?: (language: SupportedLanguage) => void;
  onLimitChange?: (exceeded: boolean) => void;
}

const DETECT_DEBOUNCE_MS = 300;

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  function CodeEditor({ onSubmit, onLanguageDetected, onLimitChange }, ref) {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState<SupportedLanguage>("javascript");
    const [highlighted, setHighlighted] = useState(false);
    const [shikiReady, setShikiReady] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const highlightedRef = useRef<HTMLDivElement>(null);
    const detectTimer = useRef<ReturnType<typeof setTimeout>>(null);

    const autoResize = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = "auto";
      const lineHeight = 24;
      const minHeight = lineHeight * 8;
      const maxHeight = lineHeight * 30;
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight,
      );
      textarea.style.height = `${newHeight}px`;
    }, []);

    useEffect(() => {
      autoResize();
    }, [autoResize]);

    const detectAndHighlight = useCallback(
      (value: string) => {
        if (detectTimer.current) {
          clearTimeout(detectTimer.current);
        }

        detectTimer.current = setTimeout(() => {
          const detected = detectLanguage(value);
          setLanguage(detected);
          setHighlighted(true);
          onLanguageDetected?.(detected);
        }, DETECT_DEBOUNCE_MS);
      },
      [onLanguageDetected],
    );

    const detectImmediately = useCallback(
      (value: string) => {
        if (detectTimer.current) {
          clearTimeout(detectTimer.current);
        }

        const detected = detectLanguage(value);
        setLanguage(detected);
        setHighlighted(true);
        onLanguageDetected?.(detected);
      },
      [onLanguageDetected],
    );

    const handleSubmit = useCallback(async () => {
      if (!code.trim()) return;

      if (detectTimer.current) {
        clearTimeout(detectTimer.current);
      }

      const detected = detectLanguage(code);
      setLanguage(detected);
      setHighlighted(true);
      onSubmit?.(code, detected);
    }, [code, onSubmit]);

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    const handleScroll = () => {
      const textarea = textareaRef.current;
      const highlightedDiv = highlightedRef.current;
      if (!textarea || !highlightedDiv) return;

      highlightedDiv.scrollTop = textarea.scrollTop;
      highlightedDiv.scrollLeft = textarea.scrollLeft;
    };

    const showOverlay = highlighted && shikiReady;

    const charCount = code.length;
    const overLimit = charCount > CODE_CHAR_LIMIT;

    useEffect(() => {
      onLimitChange?.(overLimit);
    }, [overLimit, onLimitChange]);

    return (
      <div className="overflow-hidden rounded border border-border-primary bg-bg-input">
        {/* Window Header */}
        <div className="flex h-10 items-center justify-between border-b border-border-primary px-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-accent-red" />
            <span className="size-3 rounded-full bg-accent-amber" />
            <span className="size-3 rounded-full bg-accent-green" />
          </div>
          {highlighted && (
            <LanguagePicker value={language} onChange={setLanguage} />
          )}
        </div>

        {/* Editor Area */}
        <div className="relative max-h-[600px] overflow-y-auto">
          {highlighted && (
            <div
              ref={highlightedRef}
              className="absolute inset-0 overflow-auto"
            >
              <HighlightedCode
                code={code}
                language={language}
                onReady={setShikiReady}
              />
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              const value = e.target.value;
              setCode(value);
              setShikiReady(false);
              requestAnimationFrame(autoResize);
              if (value.trim()) {
                detectAndHighlight(value);
              } else {
                if (detectTimer.current) {
                  clearTimeout(detectTimer.current);
                }
                setHighlighted(false);
                setLanguage("javascript");
              }
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text");
              const textarea = textareaRef.current;
              if (!textarea || !pasted.trim()) return;

              requestAnimationFrame(() => {
                const value = textarea.value;
                setCode(value);
                setShikiReady(false);
                autoResize();
                detectImmediately(value);
              });
            }}
            onScroll={handleScroll}
            spellCheck={false}
            rows={8}
            maxLength={CODE_CHAR_LIMIT + 500}
            className={`relative z-10 w-full resize-none bg-transparent px-4 py-4 font-mono text-xs leading-6 outline-none placeholder:text-text-tertiary ${
              showOverlay
                ? "text-transparent caret-accent-green"
                : "text-text-primary"
            }`}
            placeholder="paste your code here..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-border-primary px-4 py-1.5">
          <span
            className={`font-mono text-xs transition-colors ${
              overLimit
                ? "text-accent-red"
                : charCount > CODE_CHAR_LIMIT * 0.8
                  ? "text-accent-amber"
                  : "text-text-tertiary"
            }`}
          >
            {charCount.toLocaleString()} / {CODE_CHAR_LIMIT.toLocaleString()}
          </span>
        </div>
      </div>
    );
  },
);
