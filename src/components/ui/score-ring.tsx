import { tv, type VariantProps } from "tailwind-variants";

const scoreRingStyles = tv({
  slots: {
    container: "relative flex items-center justify-center",
    score: "font-mono font-bold leading-none",
    denom: "font-mono text-text-tertiary leading-none",
  },
  variants: {
    size: {
      sm: { container: "size-32", score: "text-2xl", denom: "text-xs" },
      md: { container: "size-44", score: "text-4xl", denom: "text-sm" },
      lg: { container: "size-52", score: "text-5xl", denom: "text-base" },
    },
    color: {
      amber: { score: "text-accent-amber" },
      green: { score: "text-accent-green" },
      red: { score: "text-accent-red" },
    },
  },
  defaultVariants: {
    size: "md",
    color: "amber",
  },
});

type ScoreRingVariants = VariantProps<typeof scoreRingStyles>;

interface ScoreRingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    ScoreRingVariants {
  score: number;
  max?: number;
}

const ScoreRing = ({
  className,
  size,
  color,
  score,
  max = 10,
  ...props
}: ScoreRingProps) => {
  const styles = scoreRingStyles({ size, color });
  const resolvedSize = size ?? "md";
  const dimension = resolvedSize === "sm" ? 128 : resolvedSize === "md" ? 176 : 208;
  const strokeWidth = resolvedSize === "sm" ? 3 : 4;

  const radius = (dimension - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = score / max;
  const dashOffset = circumference * (1 - ratio);

  const colorVar =
    color === "green"
      ? "var(--color-accent-green)"
      : color === "red"
        ? "var(--color-accent-red)"
        : "var(--color-accent-amber)";

  return (
    <div className={styles.container({ className })} {...props}>
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="absolute inset-0 -rotate-90"
        role="img"
        aria-label={`Score: ${score} out of ${max}`}
      >
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={colorVar}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="relative flex items-baseline gap-0.5">
        <span className={styles.score()}>{score}</span>
        <span className={styles.denom()}>/{max}</span>
      </div>
    </div>
  );
};

export { ScoreRing, scoreRingStyles, type ScoreRingProps, type ScoreRingVariants };
