"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CodeEditor, type CodeEditorHandle } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle, ToggleLabel } from "@/components/ui/toggle";
import { useTRPC } from "@/trpc/client";

export function CodeEditorSection() {
  const editorRef = useRef<CodeEditorHandle>(null);
  const [roastMode, setRoastMode] = useState(true);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const router = useRouter();
  const trpc = useTRPC();

  const createRoast = useMutation(
    trpc.roast.create.mutationOptions({
      onSuccess: ({ slug }) => {
        router.push(`/roast/${slug}`);
      },
    }),
  );

  const handleSubmit = (code: string, language: string) => {
    createRoast.mutate({
      sourceCode: code,
      language,
      lineCount: code.split("\n").length,
      roastMode,
    });
  };

  return (
    <>
      <CodeEditor
        ref={editorRef}
        onSubmit={handleSubmit}
        onLimitChange={setLimitExceeded}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle
            size="md"
            checked={roastMode}
            onCheckedChange={setRoastMode}
          />
          <ToggleLabel>roast mode</ToggleLabel>
          <span className="font-mono text-xs text-text-tertiary">
            {"//"} maximum sarcasm enabled
          </span>
        </div>
        <Button
          variant="primary"
          size="md"
          disabled={!roastMode || limitExceeded || createRoast.isPending}
          onClick={() => editorRef.current?.submit()}
        >
          {createRoast.isPending ? "roasting..." : "roast_my_code"}
        </Button>
      </div>
    </>
  );
}
