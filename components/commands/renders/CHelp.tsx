"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { ShortcutSection } from "@/components/ShortcutSection";
import { Shortcut } from "@/components/ui/Shortcut";
import { getCommandsByGroup } from "@/lib/command-descriptors";
import { TERMINAL_KEYBOARD_SHORTCUTS } from "@/lib/constants";

const GROUPED_COMMANDS = getCommandsByGroup();

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

      {/* ── Grouped commands with inline descriptions ── */}
      <div className="grid gap-4">
        {GROUPED_COMMANDS.map(({ meta, commands }) => (
          <ShortcutSection
            key={meta.group}
            title={tCommands(`groups.${meta.group}` as never)}
          >
            <div className="grid gap-1.5">
              {commands.map((cmd) => (
                <div
                  key={cmd.command}
                  className="grid grid-cols-[140px_1fr] items-center gap-3"
                >
                  <Shortcut
                    label={cmd.command}
                    command={cmd.command}
                    variant={meta.shortcutVariant}
                  />
                  <span className="text-muted-foreground text-xs leading-relaxed">
                    {tCommands(`descriptions.${cmd.slug}` as never)}
                  </span>
                </div>
              ))}
            </div>
          </ShortcutSection>
        ))}
      </div>

      {/* ── Keyboard shortcuts ── */}
      <ShortcutSection title={tTerminal("shortcutsHeading")}>
        <div className="grid gap-1.5">
          {TERMINAL_KEYBOARD_SHORTCUTS.map((shortcut) => (
            <div
              key={`${shortcut.slug}-${shortcut.keys.join("-")}`}
              className="grid grid-cols-[140px_1fr] items-center gap-3"
            >
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
              <span className="text-muted-foreground text-xs">
                {tTerminal(`shortcuts.${shortcut.slug}` as never)}
              </span>
            </div>
          ))}
        </div>
      </ShortcutSection>

      {/* ── Footer tip ── */}
      <p className="text-muted-foreground/60 text-xs italic">
        {tCommands("help.tip")}
      </p>
    </AnimatedSpan>
  );
}

export default CHelp;
