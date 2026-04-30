"use client";

import { ChevronDown } from "lucide-react";
import type { Ref } from "react";
import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  wrapperClassName?: string;
  selectRef?: Ref<HTMLSelectElement>;
};

function Select({
  className,
  wrapperClassName,
  children,
  selectRef,
  ...props
}: SelectProps) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <select
        ref={selectRef}
        className={cn(
          "h-8 w-full cursor-pointer appearance-none truncate whitespace-nowrap rounded-md border border-border/60 bg-background/70 py-1 pr-8 pl-2 font-mono text-foreground text-xs outline-none focus:ring-1 focus:ring-primary/50 dark:border-overlay-medium dark:bg-overlay-subtle",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
    </div>
  );
}

export { Select };
