"use client";

import { Check, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import { BUILTIN_THEME_MAP } from "@/lib/themes/palettes";
import { cn } from "@/lib/utils";
import { filterByGrep } from "@/lib/utils/grep.utils";
import type { ThemePalette } from "@/types/theme";
import { ColorSwatches } from "./ThemeColorSwatches";

export function CThemeList() {
  const t = useTranslations("Theme");
  const { theme, themes, setTheme, deleteCustomTheme } = useThemeEngine();
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const visibleThemes = filterByGrep(themes, grep, (th) => [th.name, th.label]);

  return (
    <AnimatedSpan className="gap-3">
      <p className="text-muted-foreground">
        {t.rich("list.available", {
          count: visibleThemes.length,
        })}
      </p>

      {grep && visibleThemes.length === 0 ? (
        <p className="text-muted-foreground text-xs">
          {t("list.noMatches", { pattern: grepRaw })}
        </p>
      ) : (
        <div className="terminal-scrollbar grid max-h-60 overflow-y-auto overflow-x-hidden border-y py-2 pr-2">
          {visibleThemes.map((th) => {
            const isActive = th.name === theme;
            const isCustom = !BUILTIN_THEME_MAP.has(th.name);

            return (
              <ThemeRow
                key={th.name}
                theme={th}
                isActive={isActive}
                isCustom={isCustom}
                onSetTheme={setTheme}
                onDeleteTheme={deleteCustomTheme}
              />
            );
          })}
        </div>
      )}

      {!grep && (
        <p className="text-muted-foreground/60 text-xs">{t("list.tip")}</p>
      )}
    </AnimatedSpan>
  );
}

interface ThemeInfoProps {
  label: string;
  isActive: boolean;
  isCustom: boolean;
  isDark: boolean;
}

function ThemeInfo({ label, isActive, isCustom, isDark }: ThemeInfoProps) {
  const t = useTranslations("Theme");
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
          <span className="hidden shrink-0 text-muted-foreground/50 text-xs md:inline">
            {t("list.active")}
          </span>
        )}
        {isCustom && (
          <span className="shrink-0 font-semibold text-tertiary/80 text-xs">
            {t("list.custom")}
          </span>
        )}
      </span>

      {/* Dark/light badge */}
      <span className="shrink-0 font-mono text-muted-foreground/50 text-xs">
        {isDark ? t("darkSuffix") : t("lightSuffix")}
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
  const t = useTranslations("Theme");
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(themeName);
      }}
      className="shrink-0 cursor-pointer rounded p-1.5 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
      title={t("list.deleteAria", { label: themeLabel })}
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
