"use client";

import {
  ArrowUpDown,
  CornerDownLeft,
  Delete as DeleteIcon,
  Info,
  Keyboard,
  RotateCcw,
} from "lucide-react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { getCommandsByGroup } from "@/components/commands/command-descriptors";
import { ShortcutSection } from "@/components/ShortcutSection";
import { Shortcut } from "@/components/ui/Shortcut";

/* ─── Keyboard tips ─────────────────────────────────────────────────── */

const KEYBOARD_SHORTCUTS = [
  {
    icon: <CornerDownLeft className="h-3 w-3 shrink-0" />,
    keys: ["Enter"],
    description: "Run a command",
  },
  {
    icon: <Keyboard className="h-3 w-3 shrink-0" />,
    keys: ["Tab"],
    description: "Autocomplete the current input",
  },
  {
    icon: <ArrowUpDown className="h-3 w-3 shrink-0" />,
    keys: ["↑", "↓"],
    description: "Navigate suggestions or command history",
  },
  {
    icon: <DeleteIcon className="h-3 w-3 shrink-0" />,
    keys: ["Ctrl", "L"],
    isCombined: true,
    description: "Clear the terminal screen",
  },
  {
    icon: <RotateCcw className="h-3 w-3 shrink-0" />,
    keys: ["Ctrl", "R"],
    isCombined: true,
    description: "Reset the terminal to the welcome screen",
  },
];

const GROUPED_COMMANDS = getCommandsByGroup();

/* ─── Component ─────────────────────────────────────────────────────── */

function CHelp() {
  return (
    <AnimatedSpan className="gap-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <Info className="h-3.5 w-3.5 text-chart-1 shrink-0" />
        <p className="text-chart-1 font-semibold">Available commands</p>
      </div>

      {/* ── Grouped commands with inline descriptions ── */}
      <div className="grid gap-4">
        {GROUPED_COMMANDS.map(({ meta, commands }) => (
          <ShortcutSection key={meta.group} title={meta.group}>
            <div className="grid gap-1.5">
              {commands.map((cmd) => (
                <div
                  key={cmd.command}
                  className="grid grid-cols-[140px_1fr] gap-3 items-center"
                >
                  <Shortcut
                    label={cmd.command}
                    command={cmd.command}
                    variant={meta.shortcutVariant}
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {cmd.description}
                  </span>
                </div>
              ))}
            </div>
          </ShortcutSection>
        ))}
      </div>

      {/* ── Keyboard shortcuts ── */}
      <ShortcutSection title="Keyboard shortcuts">
        <div className="grid gap-1.5">
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.keys.join(" ")}
              className="grid grid-cols-[140px_1fr] gap-3 items-center"
            >
              <span className="inline-flex items-center gap-1">
                {shortcut.icon}
                {shortcut.keys.map((key, i) => [
                  i > 0 && (
                    <span
                      key={`${key}-sep`}
                      className="text-[10px] text-muted-foreground/40"
                    >
                      {shortcut?.isCombined ? "+" : "/"}
                    </span>
                  ),
                  <kbd
                    key={key}
                    className="rounded-md border border-border/50 dark:border-white/10 bg-muted/60 dark:bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground shadow-[0_1px_0_0] shadow-border/50 dark:shadow-white/[0.06]"
                  >
                    {key}
                  </kbd>,
                ])}
              </span>
              <span className="text-xs text-muted-foreground">
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>
      </ShortcutSection>

      {/* ── Footer tip ── */}
      <p className="text-[10px] text-muted-foreground/60 italic">
        Tip: Click any command above or type it in the prompt to run it.
      </p>
    </AnimatedSpan>
  );
}

export default CHelp;
