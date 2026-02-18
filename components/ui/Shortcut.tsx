"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useCommands } from "@/components/CommandsProvider";
import { cn } from "@/lib/utils";

const shortcutVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold font-mono ring-1 ring-inset transition-[color,background-color,box-shadow,transform] duration-200 cursor-pointer active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chart-1/70",
  {
    variants: {
      variant: {
        default:
          "bg-muted/60 text-foreground ring-border/50 hover:bg-accent hover:text-accent-foreground hover:ring-border dark:bg-white/[0.04] dark:ring-white/10 dark:hover:bg-white/[0.08]",
        primary:
          "bg-chart-1/10 text-chart-1 ring-chart-1/20 hover:bg-chart-1/20 hover:ring-chart-1/30",
        secondary:
          "bg-chart-2/10 text-chart-2 ring-chart-2/20 hover:bg-chart-2/20 hover:ring-chart-2/30",
        purple:
          "bg-chart-3/10 text-chart-3 ring-chart-3/20 hover:bg-chart-3/20 hover:ring-chart-3/30",
        orange:
          "bg-chart-5/10 text-chart-5 ring-chart-5/20 hover:bg-chart-5/20 hover:ring-chart-5/30",
        pink: "bg-pink-500/10 text-pink-500 ring-pink-500/20 hover:bg-pink-500/20 hover:ring-pink-500/30 dark:bg-pink-400/10 dark:text-pink-400 dark:ring-pink-400/20 dark:hover:bg-pink-400/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ShortcutProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
    VariantProps<typeof shortcutVariants> {
  label: string;
  command: string;
}

function Shortcut({
  label,
  command,
  variant,
  className,
  ...props
}: ShortcutProps) {
  const { addCommand } = useCommands();

  return (
    <button
      type="button"
      onClick={() => addCommand(command)}
      className={cn(shortcutVariants({ variant }), className)}
      {...props}
    >
      {label}
    </button>
  );
}

export { Shortcut, shortcutVariants };
