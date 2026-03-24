import { tv, type VariantProps } from "tailwind-variants";

const tableRowStyles = tv({
  base: "flex border-b border-border-primary px-5 py-4",
});

const tableRowCellStyles = tv({
  base: "font-mono",
  variants: {
    variant: {
      rank: "w-[50px] text-xs text-text-tertiary",
      score: "w-[70px] text-xs font-bold text-accent-red",
      code: "flex-1",
      lang: "w-[100px] text-right text-xs text-text-secondary",
    },
  },
  defaultVariants: {
    variant: "code",
  },
});

type TableRowCellVariants = VariantProps<typeof tableRowCellStyles>;

interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {}

const TableRow = ({ className, ...props }: TableRowProps) => {
  return <div className={tableRowStyles({ className })} {...props} />;
};

interface TableRowCellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    TableRowCellVariants {}

const TableRowCell = ({ className, variant, ...props }: TableRowCellProps) => {
  return <div className={tableRowCellStyles({ variant, className })} {...props} />;
};

export {
  TableRow,
  TableRowCell,
  tableRowStyles,
  tableRowCellStyles,
  type TableRowProps,
  type TableRowCellProps,
  type TableRowCellVariants,
};
