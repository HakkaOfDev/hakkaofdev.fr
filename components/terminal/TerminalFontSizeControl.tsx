"use client";

import { Minus, Plus } from "lucide-react";

interface TerminalFontSizeControlProps {
  fontScale: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

function TerminalFontSizeControl({
  fontScale,
  onIncrease,
  onDecrease,
}: TerminalFontSizeControlProps) {
  const iconButtonClass =
    "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-foreground/80 transition-all hover:bg-muted/60 hover:text-foreground active:scale-95 dark:hover:bg-overlay-medium";

  return (
    <div className="grid gap-1 text-muted-foreground text-xs">
      <label htmlFor="font-size-input">Font size</label>
      <div className="flex h-8 items-center rounded-md border border-border/60 bg-background/70 px-1 dark:border-overlay-medium dark:bg-overlay-subtle">
        <button
          type="button"
          className={iconButtonClass}
          onClick={onDecrease}
          aria-label="Decrease font size"
          title="Decrease font size (Ctrl+-)"
        >
          <Minus size={12} />
        </button>

        <span className="mx-1 h-4 w-px bg-border/60 dark:bg-overlay-subtle" />

        <span className="min-w-11 flex-1 text-center font-mono text-foreground text-xs tabular-nums">
          {fontScale}%
        </span>

        <span className="mx-1 h-4 w-px bg-border/60 dark:bg-overlay-subtle" />

        <button
          type="button"
          className={iconButtonClass}
          onClick={onIncrease}
          aria-label="Increase font size"
          title="Increase font size (Ctrl++)"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

export { TerminalFontSizeControl };
