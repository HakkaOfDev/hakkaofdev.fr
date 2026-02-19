"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BUILTIN_THEME_MAP, BUILTIN_THEMES } from "../../lib/themes/palettes";
import {
  getCustomThemes,
  getStoredThemeName,
  removeCustomTheme,
  storeThemeName,
} from "../../lib/themes/storage";
import type { ThemePalette } from "../../types/theme";
import { THEME_COLOR_KEYS } from "../../types/theme";

export type ThemeEngineContextValue = {
  /** Active theme name (e.g. "dracula"). */
  theme: string;
  /** The resolved ThemePalette object. */
  palette: ThemePalette;
  /** All available themes (built-in + custom). */
  themes: ThemePalette[];
  /** Apply a theme by name and persist it. */
  setTheme: (name: string) => void;
  /** Temporarily preview a theme (auto-reverts after timeout). */
  previewTheme: (name: string, durationMs?: number) => void;
  /** Cancel an active preview. */
  cancelPreview: () => void;
  /** Whether a preview is currently active. */
  isPreview: boolean;
  /** Delete a custom theme by name. */
  deleteCustomTheme: (name: string) => void;
};

export const ThemeEngineContext = createContext<ThemeEngineContextValue | null>(
  null,
);

const DEFAULT_THEME = "default";

function applyPalette(palette: ThemePalette) {
  const root = document.documentElement;

  // Batch all style updates
  requestAnimationFrame(() => {
    // Disable transitions temporarily
    root.classList.add("theme-changing");

    // Set all color CSS variables in one go
    for (const key of THEME_COLOR_KEYS) {
      root.style.setProperty(`--${key}`, palette.colors[key]);
    }

    // Toggle dark class
    if (palette.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Re-enable transitions after a brief delay
    requestAnimationFrame(() => {
      setTimeout(() => {
        root.classList.remove("theme-changing");
      }, 0);
    });
  });
}

function lookupPalette(
  name: string,
  custom: ThemePalette[],
): ThemePalette | undefined {
  return BUILTIN_THEME_MAP.get(name) ?? custom.find((t) => t.name === name);
}

export function ThemeEngineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customThemes, setCustomThemes] = useState<ThemePalette[]>([]);
  const [themeName, setThemeName] = useState<string>(DEFAULT_THEME);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync init from localStorage on mount
  useEffect(() => {
    const stored = getStoredThemeName();
    const custom = getCustomThemes();

    setCustomThemes(custom);

    if (stored) {
      const palette = lookupPalette(stored, custom);
      if (palette) {
        setThemeName(stored);
        applyPalette(palette);
      }
    } else {
      // Apply default immediately
      const defaultPalette = BUILTIN_THEME_MAP.get(DEFAULT_THEME);
      if (defaultPalette) applyPalette(defaultPalette);
    }
  }, []);

  const allThemes = useMemo(() => {
    const combined = [...BUILTIN_THEMES, ...customThemes];
    return combined.sort((a, b) => {
      // First sort by mode: light themes first, then dark
      if (a.isDark !== b.isDark) {
        return a.isDark ? 1 : -1;
      }
      // Then sort alphabetically by label
      return a.label.localeCompare(b.label);
    });
  }, [customThemes]);

  const activeName = previewName ?? themeName;
  const palette =
    lookupPalette(activeName, customThemes) ||
    BUILTIN_THEME_MAP.get(DEFAULT_THEME) ||
    BUILTIN_THEMES[0];

  useEffect(() => {
    applyPalette(palette);
  }, [palette]);

  const setTheme = useCallback(
    (name: string) => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
        previewTimerRef.current = null;
      }
      setPreviewName(null);
      setThemeName(name);
      storeThemeName(name);

      const p = lookupPalette(name, customThemes);
      if (p) applyPalette(p);
    },
    [customThemes],
  );

  const previewTheme = useCallback(
    (name: string, durationMs = 10_000) => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);

      const p = lookupPalette(name, customThemes);
      if (!p) return;

      setPreviewName(name);
      applyPalette(p);

      previewTimerRef.current = setTimeout(() => {
        setPreviewName(null);
        previewTimerRef.current = null;
        const current = lookupPalette(themeName, customThemes);
        if (current) applyPalette(current);
      }, durationMs);
    },
    [customThemes, themeName],
  );

  const cancelPreview = useCallback(() => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    setPreviewName(null);
    const current = lookupPalette(themeName, customThemes);
    if (current) applyPalette(current);
  }, [themeName, customThemes]);

  const deleteCustomTheme = useCallback(
    (name: string) => {
      // Prevent deleting built-in themes
      if (BUILTIN_THEME_MAP.has(name)) {
        return;
      }

      // Remove from storage
      removeCustomTheme(name);

      // Update local state
      const updated = customThemes.filter((t) => t.name !== name);
      setCustomThemes(updated);

      // If the deleted theme is currently active, switch to default
      if (themeName === name) {
        setTheme(DEFAULT_THEME);
      }

      // If the deleted theme is being previewed, cancel the preview
      if (previewName === name) {
        cancelPreview();
      }
    },
    [customThemes, themeName, previewName, setTheme, cancelPreview],
  );

  const value = useMemo<ThemeEngineContextValue>(
    () => ({
      theme: themeName,
      palette,
      themes: allThemes,
      setTheme,
      previewTheme,
      cancelPreview,
      isPreview: previewName !== null,
      deleteCustomTheme,
    }),
    [
      themeName,
      palette,
      allThemes,
      setTheme,
      previewTheme,
      cancelPreview,
      previewName,
      deleteCustomTheme,
    ],
  );

  return (
    <ThemeEngineContext.Provider value={value}>
      {children}
    </ThemeEngineContext.Provider>
  );
}
