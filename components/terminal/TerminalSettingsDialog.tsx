"use client";

import { RotateCcw, X } from "lucide-react";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import { SITE, TERMINAL_KEYBOARD_SHORTCUTS } from "@/lib/constants";
import {
  DEFAULT_SCROLLBACK_LIMIT,
  DEFAULT_THEME_NAME,
  SCROLLBACK_OPTIONS,
} from "@/lib/utils/terminal.utils";
import { useTerminal } from "../providers/TerminalProvider";
import { Dialog } from "../ui/Dialog";
import { Select } from "../ui/Select";
import { TerminalFontSizeControl } from "./TerminalFontSizeControl";
import { TerminalShortcutList } from "./TerminalShortcutList";

interface TerminalSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TerminalSettingsDialog({
  open,
  onOpenChange,
}: TerminalSettingsDialogProps) {
  const { themes, theme, setTheme } = useThemeEngine();
  const {
    fontScale,
    increaseFontScale,
    decreaseFontScale,
    resetFontScale,
    fontFamily,
    setFontFamily,
    fontFamilyStack,
    fontOptions,
    scrollbackLimit,
    setScrollbackLimit,
    resetPreferences,
    resetTerminalLayout,
  } = useTerminal();

  const handleResetAll = () => {
    setTheme(DEFAULT_THEME_NAME);
    setScrollbackLimit(DEFAULT_SCROLLBACK_LIMIT);
    resetPreferences();
    resetFontScale();
    resetTerminalLayout();
  };

  const themeSelectId = "terminal-theme-select";
  const fontSelectId = "terminal-font-select";
  const scrollbackSelectId = "terminal-scrollback-select";
  const iconButtonClass =
    "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border/60 bg-background/45 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground dark:border-overlay-medium dark:hover:bg-overlay-medium";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Terminal Settings"
      headerActions={
        <>
          <button
            type="button"
            onClick={handleResetAll}
            className={iconButtonClass}
            title="Reset all settings to default (includes resize)"
            aria-label="Reset all settings"
          >
            <RotateCcw size={12} />
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={iconButtonClass}
            title="Close settings"
            aria-label="Close settings"
          >
            <X size={12} />
          </button>
        </>
      }
      className="w-full max-w-md rounded-xl border-quinary/40 bg-background p-4 shadow-quinary/5 shadow-xl sm:p-5"
      style={
        {
          "--terminal-font-family": fontFamilyStack,
          "--terminal-zoom": String(fontScale / 100),
          fontFamily: fontFamilyStack,
        } as React.CSSProperties
      }
    >
      <div className="space-y-4 [&_select]:truncate [&_select]:whitespace-nowrap">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1 text-muted-foreground text-xs">
            <label htmlFor={themeSelectId}>Theme</label>
            <Select
              id={themeSelectId}
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
            >
              {themes.map((palette) => (
                <option key={palette.name} value={palette.name}>
                  {palette.label} ({palette.isDark ? "dark" : "light"})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-1 text-muted-foreground text-xs">
            <label htmlFor={fontSelectId}>Terminal Font</label>
            <Select
              id={fontSelectId}
              value={fontFamily}
              onChange={(event) => setFontFamily(event.target.value)}
            >
              {fontOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-1 text-muted-foreground text-xs">
            <label htmlFor={scrollbackSelectId}>Scrollback</label>
            <Select
              id={scrollbackSelectId}
              value={scrollbackLimit}
              onChange={(event) =>
                setScrollbackLimit(Number(event.target.value))
              }
            >
              {SCROLLBACK_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} commands
                </option>
              ))}
            </Select>
          </div>

          <TerminalFontSizeControl
            fontScale={fontScale}
            onIncrease={increaseFontScale}
            onDecrease={decreaseFontScale}
          />
        </div>

        <TerminalShortcutList shortcuts={TERMINAL_KEYBOARD_SHORTCUTS} />

        <div className="select-none text-center">
          <span className="font-mono text-muted-foreground text-xs tabular-nums">v{SITE.version}</span>
        </div>
      </div>
    </Dialog>
  );
}

export { TerminalSettingsDialog };
