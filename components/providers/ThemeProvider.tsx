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
import { useThemeStore } from "../../stores/theme.store";
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
  const themeName = useThemeStore((state) => state.theme);
  const customThemes = useThemeStore((state) => state.customThemes);
  const setStoredTheme = useThemeStore((state) => state.setTheme);
  const removeStoredCustomTheme = useThemeStore(
    (state) => state.removeCustomTheme,
  );
  const [previewName, setPreviewName] = useState<string | null>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedCustomThemes = customThemes;

  const allThemes = useMemo(() => {
    const combined = [...BUILTIN_THEMES, ...resolvedCustomThemes];
    return combined.sort((a, b) => {
      // First sort by mode: light themes first, then dark
      if (a.isDark !== b.isDark) {
        return a.isDark ? 1 : -1;
      }
      // Then sort alphabetically by label
      return a.label.localeCompare(b.label);
    });
  }, [resolvedCustomThemes]);

  const activeName = previewName ?? themeName;
  const palette =
    lookupPalette(activeName, resolvedCustomThemes) ||
    BUILTIN_THEME_MAP.get(DEFAULT_THEME) ||
    BUILTIN_THEMES[0];

  useEffect(() => {
    applyPalette(palette);
  }, [palette]);

  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  const setTheme = useCallback(
    (name: string) => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
        previewTimerRef.current = null;
      }
      setPreviewName(null);
      setStoredTheme(name);
    },
    [setStoredTheme],
  );

  const previewTheme = useCallback(
    (name: string, durationMs = 10_000) => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);

      const p = lookupPalette(name, resolvedCustomThemes);
      if (!p) return;

      setPreviewName(name);

      previewTimerRef.current = setTimeout(() => {
        setPreviewName(null);
        previewTimerRef.current = null;
      }, durationMs);
    },
    [resolvedCustomThemes],
  );

  const cancelPreview = useCallback(() => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    setPreviewName(null);
  }, []);

  const deleteCustomTheme = useCallback(
    (name: string) => {
      // Prevent deleting built-in themes
      if (BUILTIN_THEME_MAP.has(name)) {
        return;
      }

      removeStoredCustomTheme(name);

      if (previewName === name) {
        if (previewTimerRef.current) {
          clearTimeout(previewTimerRef.current);
          previewTimerRef.current = null;
        }
        setPreviewName(null);
      }
    },
    [removeStoredCustomTheme, previewName],
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
