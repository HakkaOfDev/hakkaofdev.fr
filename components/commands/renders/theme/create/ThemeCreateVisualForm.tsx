"use client";

import { RotateCcw } from "lucide-react";
import { useId } from "react";
import { COLOR_LABELS } from "@/lib/constants/theme.constants";
import type { ThemeColors } from "@/types/theme";
import { THEME_COLOR_KEYS } from "@/types/theme";

interface ThemeCreateVisualFormProps {
  themeName: string;
  themeLabel: string;
  isDark: boolean;
  colors: ThemeColors;
  onThemeNameChange: (value: string) => void;
  onThemeLabelChange: (value: string) => void;
  onIsDarkChange: (value: boolean) => void;
  onColorChange: (key: keyof ThemeColors, value: string) => void;
  onCopyJSON: () => void;
  onResetColors: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ThemeCreateVisualForm({
  themeName,
  themeLabel,
  isDark,
  colors,
  onThemeNameChange,
  onThemeLabelChange,
  onIsDarkChange,
  onColorChange,
  onCopyJSON,
  onResetColors,
  onSubmit,
}: ThemeCreateVisualFormProps) {
  const isDarkCheckboxId = useId();

  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
            Theme ID
          </span>
          <input
            type="text"
            value={themeName}
            onChange={(e) =>
              onThemeNameChange(
                e.target.value.toLowerCase().replace(/\s+/g, "-"),
              )
            }
            placeholder="my-custom-theme"
            className="w-full rounded-md border border-border bg-muted/30 px-3 py-1.5 font-mono text-foreground text-xs outline-none placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50"
            required
          />
        </label>
        <label className="grid gap-1.5">
          <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
            Display Name
          </span>
          <input
            type="text"
            value={themeLabel}
            onChange={(e) => onThemeLabelChange(e.target.value)}
            placeholder="My Custom Theme"
            className="w-full rounded-md border border-border bg-muted/30 px-3 py-1.5 text-foreground text-xs outline-none placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50"
            required
          />
        </label>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
        <div className="flex-1">
          <label
            htmlFor={isDarkCheckboxId}
            className="block cursor-pointer select-none font-medium text-foreground text-sm"
          >
            Theme Mode
          </label>
          <p className="mt-0.5 text-muted-foreground text-xs">
            {isDark ? "Dark theme" : "Light theme"}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-labelledby={isDarkCheckboxId}
          onClick={() => onIsDarkChange(!isDark)}
          className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 ${
            isDark ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`pointer-events-none m-0.5 inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
              isDark ? "translate-x-7" : "translate-x-0"
            }`}
          >
            {isDark ? (
              <svg
                className="h-3.5 w-3.5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg
                className="h-3.5 w-3.5 text-secondary"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
        </button>
      </div>

      <div className="border-border border-t pt-2">
        <p className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
          Colors
        </p>
        <div className="terminal-scrollbar grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-3">
          {THEME_COLOR_KEYS.map((key) => (
            <label key={key} className="group flex items-center gap-2">
              <input
                type="color"
                value={colors[key]}
                onChange={(e) => onColorChange(key, e.target.value)}
                className="h-8 w-8 shrink-0 cursor-pointer"
                aria-label={`${COLOR_LABELS[key]} color picker`}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-foreground text-xs">
                  {COLOR_LABELS[key]}
                </span>
                <input
                  type="text"
                  value={colors[key]}
                  onChange={(e) => onColorChange(key, e.target.value)}
                  className="w-full bg-transparent font-mono text-[9px] text-muted-foreground outline-none focus:text-foreground"
                  aria-label={`${COLOR_LABELS[key]} color value`}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-border border-t pt-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-primary/10 px-4 py-1.5 font-semibold text-primary text-xs ring-1 ring-primary/20 ring-inset transition-colors hover:bg-primary/20"
        >
          Create Theme
        </button>
        <button
          type="button"
          onClick={onCopyJSON}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 font-semibold text-muted-foreground text-xs transition-colors hover:bg-accent/50 hover:text-foreground"
          aria-label="Copy JSON to clipboard"
        >
          Copy JSON
        </button>
        <button
          type="button"
          onClick={onResetColors}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold text-muted-foreground text-xs transition-colors hover:bg-accent/50 hover:text-foreground"
          aria-label="Reset colors to defaults"
          title="Reset colors to defaults"
        >
          <RotateCcw className="h-3 w-3" />
          Reset Colors
        </button>
      </div>
    </form>
  );
}
