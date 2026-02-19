"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useCommands } from "@/components/providers/CommandsProvider";
import { cn } from "@/lib/utils";

const shortcutVariants = cva(
  "inline-flex w-fit cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 font-mono font-semibold text-xs ring-1 ring-inset transition-[color,background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-muted/60 text-foreground ring-border/50 hover:bg-accent hover:text-accent-foreground hover:ring-border dark:bg-overlay-subtle dark:ring-overlay-medium dark:hover:bg-overlay-medium",
        primary:
          "bg-primary/10 text-primary ring-primary/20 hover:bg-primary/20 hover:ring-primary/30",
        secondary:
          "bg-secondary/10 text-secondary ring-secondary/20 hover:bg-secondary/20 hover:ring-secondary/30",
        purple:
          "bg-tertiary/10 text-tertiary ring-tertiary/20 hover:bg-tertiary/20 hover:ring-tertiary/30",
        orange:
          "bg-quaternary/10 text-quaternary ring-quaternary/20 hover:bg-quaternary/20 hover:ring-quaternary/30",
        pink: "bg-quinary/10 text-quinary ring-quinary/20 hover:bg-quinary/20 hover:ring-quinary/30",
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
  disabled?: boolean;
}

function Shortcut({
  label,
  command,
  variant,
  className,
  disabled = false,
  ...props
}: ShortcutProps) {
  const { addCommand } = useCommands();

  return (
    <button
      type="button"
      onClick={disabled ? undefined : () => addCommand(command)}
      className={cn(
        shortcutVariants({ variant }),
        disabled && "cursor-default active:scale-100",
        className,
      )}
      aria-disabled={disabled}
      {...props}
    >
      {label}
    </button>
  );
}

export { Shortcut, shortcutVariants };
