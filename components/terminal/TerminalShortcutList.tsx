"use client";

import type { TerminalShortcut } from "@/types/terminal";

interface TerminalShortcutListProps {
  shortcuts: ReadonlyArray<TerminalShortcut>;
}

function TerminalShortcutList({ shortcuts }: TerminalShortcutListProps) {
  return (
    <div className="space-y-2 rounded-xl border border-border/50 bg-background/30 p-3 dark:border-overlay-medium">
      <p className="font-medium text-muted-foreground text-xs">
        Keyboard shortcuts
      </p>
      <div className="grid gap-1.5">
        {shortcuts.map((shortcut) => (
          <div
            key={`${shortcut.keys.join("-")}-${shortcut.description}`}
            className="grid grid-cols-[140px_1fr] items-center gap-3"
          >
            <span className="inline-flex items-center gap-1">
              {shortcut.keys.map((key, index) => (
                <span
                  key={`${shortcut.description}-${key}`}
                  className="inline-flex items-center gap-1"
                >
                  {index > 0 ? (
                    <span className="text-muted-foreground/40 text-xs">
                      {shortcut.isCombined ? "+" : "/"}
                    </span>
                  ) : null}
                  <kbd className="rounded-md border border-border/50 bg-muted/60 px-1.5 py-0.5 font-mono text-muted-foreground text-xs shadow-[0_1px_0_0] shadow-border/50 dark:border-overlay-medium dark:bg-overlay-subtle dark:shadow-overlay-subtle">
                    {key}
                  </kbd>
                </span>
              ))}
            </span>
            <span className="text-muted-foreground text-xs">
              {shortcut.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { TerminalShortcutList };
