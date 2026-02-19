import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-[10px] leading-none ring-1 ring-inset",
  {
    variants: {
      variant: {
        default:
          "bg-muted/60 text-muted-foreground ring-border/50 dark:bg-overlay-subtle dark:ring-overlay-medium",
        teal: "bg-primary/10 text-primary ring-primary/20",
        gold: "bg-secondary/10 text-secondary ring-secondary/20",
        purple: "bg-tertiary/10 text-tertiary ring-tertiary/20",
        orange: "bg-quaternary/10 text-quaternary ring-quaternary/20",
        pink: "bg-quinary/10 text-quinary ring-quinary/20",
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
