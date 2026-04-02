import { tv } from "tailwind-variants";

export const skeleton = tv({
  base: "animate-pulse rounded bg-bg-elevated",
});

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={skeleton({ class: className })} {...props} />;
}
