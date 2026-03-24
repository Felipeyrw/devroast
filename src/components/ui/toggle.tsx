import { Switch } from "@base-ui/react/switch";
import { tv, type VariantProps } from "tailwind-variants";

const toggleStyles = tv({
  slots: {
    root: [
      "relative inline-flex items-center rounded-full",
      "bg-border-primary transition-colors",
      "data-[checked]:bg-accent-green",
    ],
    thumb: [
      "inline-block rounded-full bg-bg-page",
      "shadow transition-transform",
      "data-[checked]:translate-x-[calc(100%-2px)]",
    ],
    wrapper: "inline-flex items-center gap-3",
  },
  variants: {
    size: {
      sm: {
        root: "h-5 w-9 p-0.5",
        thumb: "size-4",
      },
      md: {
        root: "h-6 w-11 p-0.5",
        thumb: "size-5",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type ToggleVariants = VariantProps<typeof toggleStyles>;

interface ToggleProps extends ToggleVariants {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Toggle = ({
  size,
  className,
  ...switchProps
}: ToggleProps) => {
  const styles = toggleStyles({ size });

  return (
    <label className={styles.wrapper({ className })}>
      <Switch.Root className={styles.root()} {...switchProps}>
        <Switch.Thumb className={styles.thumb()} />
      </Switch.Root>
    </label>
  );
};

interface ToggleLabelProps extends React.HTMLAttributes<HTMLSpanElement> {}

const ToggleLabel = ({ className, ...props }: ToggleLabelProps) => {
  return (
    <span
      className={`font-mono text-sm text-text-secondary ${className ?? ""}`}
      {...props}
    />
  );
};

export {
  Toggle,
  ToggleLabel,
  toggleStyles,
  type ToggleProps,
  type ToggleVariants,
  type ToggleLabelProps,
};
