import { tv, type VariantProps } from "tailwind-variants";

const buttonStyles = tv({
  base: [
    "inline-flex items-center justify-center",
    "font-mono font-medium",
    "transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    variant: {
      primary: "bg-accent-green text-bg-page enabled:hover:brightness-90",
      secondary:
        "border border-border-primary text-text-primary enabled:hover:bg-bg-elevated",
      link: "border border-border-primary text-text-secondary enabled:hover:text-text-primary",
    },
    size: {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-6 py-2.5 text-sm gap-2",
      lg: "px-8 py-3 text-base gap-2.5",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonVariants = VariantProps<typeof buttonStyles>;

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {}

const Button = ({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props}>
      {children}
    </button>
  );
};

export { Button, type ButtonProps, type ButtonVariants, buttonStyles };
