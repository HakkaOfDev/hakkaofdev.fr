"use client";

import { useTranslations } from "next-intl";
import { Fragment } from "react";
import type { TerminalShortcut } from "@/types/terminal";

interface TerminalShortcutListProps {
  shortcuts: ReadonlyArray<TerminalShortcut>;
}

function TerminalShortcutList({ shortcuts }: TerminalShortcutListProps) {
  const t = useTranslations("Terminal");
  return (
    <div className="space-y-2 rounded-xl border border-border/50 bg-background/30 p-3 dark:border-overlay-medium">
      <p className="font-medium text-muted-foreground text-xs">
        {t("shortcutsHeading")}
      </p>
      <div className="grid grid-cols-[max-content_1fr] items-center gap-x-3 gap-y-1.5">
        {shortcuts.map((shortcut) => (
          <Fragment key={`${shortcut.keys.join("-")}-${shortcut.slug}`}>
            <span className="inline-flex items-center gap-1" dir="ltr">
              {shortcut.keys.map((key, index) => (
                <span
                  key={`${shortcut.slug}-${key}`}
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
            <span className="min-w-0 text-muted-foreground text-xs">
              {t(`shortcuts.${shortcut.slug}` as never)}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export { TerminalShortcutList };
