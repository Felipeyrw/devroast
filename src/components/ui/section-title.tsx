import { tv, type VariantProps } from "tailwind-variants";

const sectionTitleStyles = tv({
  base: "flex items-center gap-2 font-mono text-sm font-bold",
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type SectionTitleVariants = VariantProps<typeof sectionTitleStyles>;

interface SectionTitleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    SectionTitleVariants {}

const SectionTitle = ({
  className,
  size,
  children,
  ...props
}: SectionTitleProps) => {
  return (
    <div className={sectionTitleStyles({ size, className })} {...props}>
      <span className="text-accent-green">{"//"}</span>
      <span className="text-text-primary">{children}</span>
    </div>
  );
};

export {
  SectionTitle,
  sectionTitleStyles,
  type SectionTitleProps,
  type SectionTitleVariants,
};
