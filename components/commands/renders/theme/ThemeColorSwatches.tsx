"use client";

import { cn } from "@/lib/utils";
import type { ThemePalette } from "@/types/theme";

/** Token order shown in the swatch strip — same shape used by `theme list`. */
export const SWATCH_KEYS = [
  "background",
  "foreground",
  "muted",
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
] as const;

interface ColorSwatchesProps {
  colors: ThemePalette["colors"];
  className?: string;
}

export function ColorSwatches({ colors, className }: ColorSwatchesProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 gap-px overflow-hidden rounded-full border",
        className,
      )}
    >
      {SWATCH_KEYS.map((key) => (
        <span
          key={key}
          className="h-4 w-2 first:rounded-l-sm last:rounded-r-sm"
          style={{ backgroundColor: colors[key] }}
        />
      ))}
    </div>
  );
}
