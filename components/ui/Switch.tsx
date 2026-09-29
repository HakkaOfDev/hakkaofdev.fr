"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

const SIZES = {
  sm: { track: "h-4 w-7", thumb: "h-3 w-3", on: "translate-x-3" },
  md: { track: "h-7 w-14", thumb: "h-6 w-6", on: "translate-x-7" },
} as const;

type SwitchProps = Omit<
  React.ComponentProps<"button">,
  "onChange" | "role" | "type" | "children"
> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  size?: keyof typeof SIZES;
  /** Rendered inside the thumb, e.g. an icon reflecting the current state. */
  thumb?: React.ReactNode;
};

/**
 * iOS-style toggle. A `<button role="switch">`, so it can be labelled with a
 * `<label htmlFor>` or `aria-label` and toggled with Space/Enter.
 */
function Switch({
  checked,
  onCheckedChange,
  size = "sm",
  thumb,
  className,
  onClick,
  ...props
}: SwitchProps) {
  const s = SIZES[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      data-slot="switch"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onCheckedChange(!checked);
      }}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "bg-primary"
          : "bg-muted-foreground/30 hover:bg-muted-foreground/40",
        s.track,
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none m-0.5 inline-flex transform items-center justify-center rounded-full bg-background shadow-md transition-transform duration-200 ease-in-out",
          s.thumb,
          checked ? s.on : "translate-x-0",
        )}
      >
        {thumb}
      </span>
    </button>
  );
}

export { Switch };
