import { tv, type VariantProps } from "tailwind-variants";

const diffLineStyles = tv({
  base: "flex items-baseline gap-2 px-4 py-2 font-mono text-sm",
  variants: {
    type: {
      removed: "bg-diff-removed-bg",
      added: "bg-diff-added-bg",
      context: "bg-transparent",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

const prefixColorClassMap = {
  removed: "text-accent-red",
  added: "text-accent-green",
  context: "text-text-tertiary",
} as const;

const codeColorClassMap = {
  removed: "text-text-secondary",
  added: "text-text-primary",
  context: "text-text-secondary",
} as const;

type DiffLineVariants = VariantProps<typeof diffLineStyles>;

interface DiffLineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    DiffLineVariants {
  content: string;
}

const DiffLine = ({ className, type, content, ...props }: DiffLineProps) => {
  const resolvedType = type ?? "context";
  const prefix = resolvedType === "removed" ? "-" : resolvedType === "added" ? "+" : " ";

  return (
    <div className={diffLineStyles({ type: resolvedType, className })} {...props}>
      <span className={prefixColorClassMap[resolvedType]}>{prefix}</span>
      <span className={codeColorClassMap[resolvedType]}>{content}</span>
    </div>
  );
};

export { DiffLine, diffLineStyles, type DiffLineProps, type DiffLineVariants };
