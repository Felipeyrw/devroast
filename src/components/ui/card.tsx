import { tv, type VariantProps } from "tailwind-variants";

const cardStyles = tv({
  base: "flex flex-col gap-3 border border-border-primary bg-bg-input p-5",
});

const cardBadgeStyles = tv({
  base: "inline-flex items-center gap-2 font-mono text-xs",
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      verdict: "text-accent-red",
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

type CardBadgeVariants = VariantProps<typeof cardBadgeStyles>;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = ({ className, ...props }: CardProps) => {
  return <div className={cardStyles({ className })} {...props} />;
};

interface CardBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardBadgeVariants {}

const CardBadge = ({ className, variant, children, ...props }: CardBadgeProps) => {
  return (
    <div className={cardBadgeStyles({ variant, className })} {...props}>
      <span className="inline-block size-2 rounded-full bg-current" />
      {children}
    </div>
  );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardTitle = ({ className, ...props }: CardTitleProps) => {
  return (
    <p
      className={`font-mono text-sm text-text-primary ${className ?? ""}`}
      {...props}
    />
  );
};

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = ({ className, ...props }: CardDescriptionProps) => {
  return (
    <p
      className={`font-mono text-xs leading-relaxed text-text-secondary ${className ?? ""}`}
      {...props}
    />
  );
};

export {
  Card,
  CardBadge,
  CardTitle,
  CardDescription,
  cardStyles,
  cardBadgeStyles,
  type CardProps,
  type CardBadgeProps,
  type CardBadgeVariants,
  type CardTitleProps,
  type CardDescriptionProps,
};
