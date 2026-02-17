"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className={cn(
        "size-7 min-w-7 relative hover:bg-muted/60 dark:hover:bg-white/[0.08] transition-all flex items-center justify-center rounded-md cursor-pointer duration-200 px-0 active:scale-90",
        className,
      )}
      aria-label="Toggle theme"
      title="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      <SunIcon
        size={14}
        className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground"
      />
      <MoonIcon
        size={14}
        className="absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground"
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
