"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Shortcut } from "@/components/ui/Shortcut";
import { getCommandsByGroup } from "@/lib/command-descriptors";
import { TERMINAL_KEYBOARD_SHORTCUTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const GROUPED_COMMANDS = getCommandsByGroup();

/* ─── Inline section heading that spans the full grid width ─── */

function SectionHeading({
  title,
  withTopSpacing,
}: {
  title: string;
  withTopSpacing?: boolean;
}) {
  return (
    <div
      className={cn(
        "col-span-2 flex items-center gap-2",
        withTopSpacing && "mt-3",
      )}
      aria-hidden
    >
      <span className="font-semibold text-[10px] text-muted-foreground/80 uppercase tracking-widest">
        {title}
      </span>
      <div className="h-px flex-1 bg-border/40 dark:bg-overlay-medium" />
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────────────── */

function CHelp() {
  const tCommands = useTranslations("Commands");
  const tTerminal = useTranslations("Terminal");

  return (
    <AnimatedSpan className="gap-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="font-semibold text-primary">
          {tCommands("help.available")}
        </p>
      </div>

      {/* ── Single grid for every group + the keyboard-shortcuts list ── */}
      <div className="grid grid-cols-[max-content_1fr] items-center gap-x-3 gap-y-1.5">
        {GROUPED_COMMANDS.map(({ meta, commands }, idx) => (
          <Fragment key={meta.group}>
            <SectionHeading
              title={tCommands(`groups.${meta.group}` as never)}
              withTopSpacing={idx > 0}
            />
            {commands.map((cmd) => (
              <Fragment key={cmd.command}>
                <Shortcut
                  label={cmd.command}
                  command={cmd.command}
                  variant={meta.shortcutVariant}
                />
                <span className="min-w-0 text-muted-foreground text-xs leading-relaxed">
                  {tCommands(`descriptions.${cmd.slug}` as never)}
                </span>
              </Fragment>
            ))}
          </Fragment>
        ))}

        <SectionHeading title={tTerminal("shortcutsHeading")} withTopSpacing />
        {TERMINAL_KEYBOARD_SHORTCUTS.map((shortcut) => (
          <Fragment key={`${shortcut.slug}-${shortcut.keys.join("-")}`}>
            <span className="inline-flex items-center gap-1" dir="ltr">
              {shortcut.keys.map((key, i) => (
                <span
                  key={`${shortcut.slug}-${key}`}
                  className="inline-flex items-center gap-1"
                >
                  {i > 0 && (
                    <span className="text-muted-foreground/40 text-xs">
                      {shortcut?.isCombined ? "+" : "/"}
                    </span>
                  )}
                  <kbd className="rounded-md border border-border/50 bg-muted/60 px-1.5 py-0.5 font-mono text-muted-foreground text-xs shadow-[0_1px_0_0] shadow-border/50 dark:border-overlay-medium dark:bg-overlay-subtle dark:shadow-overlay-subtle">
                    {key}
                  </kbd>
                </span>
              ))}
            </span>
            <span className="min-w-0 text-muted-foreground text-xs">
              {tTerminal(`shortcuts.${shortcut.slug}` as never)}
            </span>
          </Fragment>
        ))}
      </div>

      {/* ── Footer tip ── */}
      <p className="text-muted-foreground/60 text-xs italic">
        {tCommands("help.tip")}
      </p>
    </AnimatedSpan>
  );
}

export default CHelp;
