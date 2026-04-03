import { tv, type VariantProps } from "tailwind-variants";

const badgeStyles = tv({
  slots: {
    root: "inline-flex items-center gap-2 font-mono text-xs",
    dot: "inline-block size-2 rounded-full",
  },
  variants: {
    variant: {
      critical: { root: "text-accent-red", dot: "bg-accent-red" },
      warning: { root: "text-accent-amber", dot: "bg-accent-amber" },
      good: { root: "text-accent-green", dot: "bg-accent-green" },
      verdict: { root: "text-accent-red", dot: "bg-accent-red" },
      needs_serious_help: { root: "text-accent-red", dot: "bg-accent-red" },
      mediocre: { root: "text-accent-amber", dot: "bg-accent-amber" },
      acceptable: { root: "text-accent-cyan", dot: "bg-accent-cyan" },
      good_job: { root: "text-accent-green", dot: "bg-accent-green" },
      chefs_kiss: { root: "text-accent-green", dot: "bg-accent-green" },
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

type BadgeVariants = VariantProps<typeof badgeStyles>;

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariants {}

const Badge = ({ className, variant, children, ...props }: BadgeProps) => {
  const styles = badgeStyles({ variant });

  return (
    <div className={styles.root({ className })} {...props}>
      <span className={styles.dot()} />
      {children}
    </div>
  );
};

export { Badge, type BadgeProps, type BadgeVariants, badgeStyles };
