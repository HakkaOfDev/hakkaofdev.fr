"use client";

import { RotateCcw, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ColorSwatches } from "@/components/commands/renders/theme/ThemeColorSwatches";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
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
  const t = useTranslations("Terminal");
  const tNames = useTranslations("Lang.names");
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const { themes, theme, setTheme, palette } = useThemeEngine();
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

  const handleLocaleChange = (next: string) => {
    if (next === currentLocale) return;
    if (!(routing.locales as readonly string[]).includes(next)) return;
    router.replace(pathname, { locale: next as Locale });
  };

  const themeSelectId = "terminal-theme-select";
  const fontSelectId = "terminal-font-select";
  const scrollbackSelectId = "terminal-scrollback-select";
  const languageSelectId = "terminal-language-select";
  const iconButtonClass =
    "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border/60 bg-background/45 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground dark:border-overlay-medium dark:hover:bg-overlay-medium";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("settings.title")}
      headerActions={
        <>
          <button
            type="button"
            onClick={handleResetAll}
            className={iconButtonClass}
            title={t("settings.resetAllTitle")}
            aria-label={t("settings.resetAllLabel")}
          >
            <RotateCcw size={12} />
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={iconButtonClass}
            title={t("settings.closeTitle")}
            aria-label={t("settings.closeLabel")}
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
            <label htmlFor={languageSelectId}>
              {t("settings.languageLabel")}
            </label>
            <Select
              id={languageSelectId}
              value={currentLocale}
              onChange={(event) => handleLocaleChange(event.target.value)}
            >
              {routing.locales.map((code) => (
                <option key={code} value={code}>
                  {tNames(code as never)}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-1 text-muted-foreground text-xs">
            <label htmlFor={fontSelectId}>{t("settings.fontLabel")}</label>
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
            <label htmlFor={scrollbackSelectId}>
              {t("settings.scrollbackLabel")}
            </label>
            <Select
              id={scrollbackSelectId}
              value={scrollbackLimit}
              onChange={(event) =>
                setScrollbackLimit(Number(event.target.value))
              }
            >
              {SCROLLBACK_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {t("settings.scrollbackOption", { count: option })}
                </option>
              ))}
            </Select>
          </div>

          <TerminalFontSizeControl
            fontScale={fontScale}
            onIncrease={increaseFontScale}
            onDecrease={decreaseFontScale}
          />

          {/* Theme — full width row, select on left, live swatches on right */}
          <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 sm:items-end">
            <div className="grid gap-1 text-muted-foreground text-xs">
              <label htmlFor={themeSelectId}>{t("settings.themeLabel")}</label>
              <Select
                id={themeSelectId}
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
              >
                {themes.map((p) => (
                  <option key={p.name} value={p.name}>
                    {t("settings.themeOption", {
                      label: p.label,
                      mode: p.isDark
                        ? t("settings.darkSuffix")
                        : t("settings.lightSuffix"),
                    })}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex h-8 items-center justify-end sm:justify-start">
              <ColorSwatches colors={palette.colors} />
            </div>
          </div>
        </div>

        <TerminalShortcutList shortcuts={TERMINAL_KEYBOARD_SHORTCUTS} />

        <div className="select-none text-center">
          <span className="font-mono text-muted-foreground text-xs tabular-nums">
            v{SITE.version}
          </span>
        </div>
      </div>
    </Dialog>
  );
}

export { TerminalSettingsDialog };
