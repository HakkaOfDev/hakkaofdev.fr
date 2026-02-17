import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset leading-none",
  {
    variants: {
      variant: {
        default:
          "bg-muted/60 text-muted-foreground ring-border/50 dark:bg-white/[0.04] dark:ring-white/10",
        teal: "bg-chart-1/10 text-chart-1 ring-chart-1/20",
        gold: "bg-chart-4/10 text-chart-4 ring-chart-4/20",
        purple: "bg-chart-3/10 text-chart-3 ring-chart-3/20",
        orange: "bg-chart-5/10 text-chart-5 ring-chart-5/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  icon?: React.ReactNode;
  label: string;
}

function Tag({ icon, label, variant, className, ...props }: TagProps) {
  return (
    <span className={cn(tagVariants({ variant }), className)} {...props}>
      {icon}
      {label}
    </span>
  );
}

export { Tag, tagVariants };
