import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
  showWindowHeader?: boolean;
  filename?: string;
}

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`;

const CodeBlock = async ({
  code,
  language = "javascript",
  showWindowHeader = false,
  filename,
}: CodeBlockProps) => {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "vesper",
  });

  const lines = code.split("\n");

  return (
    <div className="overflow-hidden rounded border border-border-primary bg-bg-input">
      {/* Window Header - only shown when showWindowHeader is true */}
      {showWindowHeader && (
        <div className="flex h-10 items-center border-b border-border-primary px-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-accent-red" />
            <span className="size-3 rounded-full bg-accent-amber" />
            <span className="size-3 rounded-full bg-accent-green" />
          </div>
          {filename && (
            <span className="ml-4 font-mono text-xs text-text-secondary">
              {filename}
            </span>
          )}
        </div>
      )}

      {/* Code Content */}
      <div className="flex">
        {/* Line Numbers */}
        <div className="flex w-12 shrink-0 flex-col items-end border-r border-border-primary bg-bg-surface px-3 py-4">
          {lines.map((_, i) => (
            <span
              key={i}
              className="font-mono text-xs leading-6 text-text-tertiary"
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Syntax Highlighted Code */}
        <div
          className="flex-1 overflow-x-auto p-4 font-mono text-xs leading-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export { CodeBlock, type CodeBlockProps, sampleCode };
