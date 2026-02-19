"use client";

import { Palette } from "lucide-react";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import { cn } from "@/lib/utils";
import type { ThemePalette } from "@/types/theme";

export function CycleTheme({ className }: { className?: string }) {
  const { palette, themes, setTheme } = useThemeEngine();

  const currentIdx = themes.findIndex(
    (t: ThemePalette) => t.name === palette.name,
  );

  function cycleTheme() {
    const nextIdx = (currentIdx + 1) % themes.length;
    setTheme(themes[nextIdx].name);
  }

  return (
    <button
      type="button"
      className={cn(
        "relative flex size-7 min-w-7 cursor-pointer items-center justify-center rounded-md px-0 transition-all duration-200 hover:bg-muted/60 active:scale-90 dark:hover:bg-overlay-medium",
        className,
      )}
      aria-label={`Current theme: ${palette.label}. Click to cycle.`}
      title={`Theme: ${palette.label}`}
      onClick={cycleTheme}
    >
      <Palette size={14} className="text-muted-foreground" />
      <span className="sr-only">Cycle theme</span>
    </button>
  );
}
