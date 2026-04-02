"use client";

import { useRef, useState } from "react";
import { CodeEditor, type CodeEditorHandle } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle, ToggleLabel } from "@/components/ui/toggle";

export function CodeEditorSection() {
  const editorRef = useRef<CodeEditorHandle>(null);
  const [roastMode, setRoastMode] = useState(true);
  const [limitExceeded, setLimitExceeded] = useState(false);

  return (
    <>
      <CodeEditor ref={editorRef} onLimitChange={setLimitExceeded} />
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
          disabled={!roastMode || limitExceeded}
          onClick={() => editorRef.current?.submit()}
        >
          roast_my_code
        </Button>
      </div>
    </>
  );
}
