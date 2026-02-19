"use client";

import { Check, Trash2 } from "lucide-react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import { BUILTIN_THEME_MAP } from "@/lib/themes/palettes";
import { cn } from "@/lib/utils";
import type { ThemePalette } from "@/types/theme";

const SWATCH_KEYS = [
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
}

export function CThemeList() {
  const { theme, themes, setTheme, deleteCustomTheme } = useThemeEngine();

  return (
    <AnimatedSpan className="gap-3">
      <p className="text-muted-foreground">
        Available themes (
        <span className="font-semibold text-foreground">{themes.length}</span>):
      </p>

      <div className="terminal-scrollbar grid max-h-60 gap-2 overflow-y-auto overflow-x-hidden border-y py-2 pr-2">
        {themes.map((t) => {
          const isActive = t.name === theme;
          const isCustom = !BUILTIN_THEME_MAP.has(t.name);

          return (
            <ThemeRow
              key={t.name}
              theme={t}
              isActive={isActive}
              isCustom={isCustom}
              onSetTheme={setTheme}
              onDeleteTheme={deleteCustomTheme}
            />
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground/60">
        Tap or click on a theme to apply it.
      </p>
    </AnimatedSpan>
  );
}

function ColorSwatches({ colors }: ColorSwatchesProps) {
  return (
    <div className="flex shrink-0 gap-px overflow-hidden rounded-full border">
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

interface ThemeInfoProps {
  label: string;
  isActive: boolean;
  isCustom: boolean;
  isDark: boolean;
}

function ThemeInfo({ label, isActive, isCustom, isDark }: ThemeInfoProps) {
  return (
    <>
      {/* Theme name */}
      <span className="flex min-w-0 items-center gap-1.5 font-mono text-xs">
        {isActive && <Check className="h-3 w-3 shrink-0 text-primary" />}
        <span
          className={`truncate ${
            isActive ? "font-semibold text-primary" : "text-foreground"
          }`}
        >
          {label}
        </span>
        {isActive && (
          <span className="hidden shrink-0 text-[10px] text-muted-foreground/50 md:inline">
            (active)
          </span>
        )}
        {isCustom && (
          <span className="shrink-0 font-semibold text-[10px] text-tertiary/80">
            custom
          </span>
        )}
      </span>

      {/* Dark/light badge */}
      <span className="shrink-0 font-mono text-[10px] text-muted-foreground/50">
        {isDark ? "dark" : "light"}
      </span>
    </>
  );
}

interface DeleteButtonProps {
  themeName: string;
  themeLabel: string;
  onDelete: (name: string) => void;
}

function DeleteButton({ themeName, themeLabel, onDelete }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(themeName);
      }}
      className="shrink-0 cursor-pointer rounded p-1.5 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
      title={`Delete ${themeLabel}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}

interface ThemeRowProps {
  theme: ThemePalette;
  isActive: boolean;
  isCustom: boolean;
  onSetTheme: (name: string) => void;
  onDeleteTheme: (name: string) => void;
}

function ThemeRow({
  theme,
  isActive,
  isCustom,
  onSetTheme,
  onDeleteTheme,
}: ThemeRowProps) {
  const content = (
    <>
      <ColorSwatches colors={theme.colors} />
      <ThemeInfo
        label={theme.label}
        isActive={isActive}
        isCustom={isCustom}
        isDark={theme.isDark}
      />
    </>
  );

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 px-2",
        isCustom && "pr-0",
      )}
    >
      {isActive ? (
        <div className="flex min-w-0 flex-1 items-center gap-3 py-1.5">
          {content}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onSetTheme(theme.name)}
          className="-mx-2 flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded px-2 py-1.5 transition-colors hover:bg-accent/50 active:bg-accent"
        >
          {content}
        </button>
      )}

      {isCustom && (
        <DeleteButton
          themeName={theme.name}
          themeLabel={theme.label}
          onDelete={onDeleteTheme}
        />
      )}
    </div>
  );
}
