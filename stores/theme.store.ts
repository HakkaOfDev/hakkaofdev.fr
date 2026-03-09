"use client";

import { BUILTIN_THEME_MAP } from "@/lib/themes/palettes";
import { DEFAULT_THEME_NAME } from "@/lib/utils/terminal.utils";
import { THEME_COLOR_KEYS, type ThemePalette } from "@/types/theme";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const LEGACY_THEME_KEY = "terminal-theme";
const LEGACY_CUSTOM_THEMES_KEY = "terminal-custom-themes";

type PersistedThemeState = {
  theme: string;
  customThemes: ThemePalette[];
};

type ThemeStore = {
  theme: string;
  customThemes: ThemePalette[];
  setTheme: (name: string) => void;
  upsertCustomTheme: (palette: ThemePalette) => void;
  removeCustomTheme: (name: string) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseThemePalette(input: unknown): ThemePalette | null {
  if (!isRecord(input)) return null;
  if (typeof input.name !== "string") return null;
  if (typeof input.label !== "string") return null;
  if (typeof input.isDark !== "boolean") return null;
  if (!isRecord(input.colors)) return null;

  const colors = {} as ThemePalette["colors"];
  for (const key of THEME_COLOR_KEYS) {
    const value = input.colors[key];
    if (typeof value !== "string") {
      return null;
    }
    colors[key] = value;
  }

  return {
    name: input.name,
    label: input.label,
    isDark: input.isDark,
    colors,
  };
}

function parseThemePalettes(input: unknown): ThemePalette[] {
  if (!Array.isArray(input)) return [];

  const palettes: ThemePalette[] = [];
  for (const rawPalette of input) {
    const parsed = parseThemePalette(rawPalette);
    if (!parsed) continue;

    const alreadyExists = palettes.some((palette) => palette.name === parsed.name);
    if (!alreadyExists) {
      palettes.push(parsed);
    }
  }

  return palettes;
}

function hasTheme(name: string, customThemes: ThemePalette[]): boolean {
  if (BUILTIN_THEME_MAP.has(name)) return true;
  return customThemes.some((theme) => theme.name === name);
}

function resolveThemeName(name: string, customThemes: ThemePalette[]): string {
  if (hasTheme(name, customThemes)) return name;
  return DEFAULT_THEME_NAME;
}

function parsePersistedThemeState(input: unknown): PersistedThemeState | null {
  if (!isRecord(input)) return null;

  const customThemes = parseThemePalettes(input.customThemes);
  const theme =
    typeof input.theme === "string"
      ? resolveThemeName(input.theme, customThemes)
      : DEFAULT_THEME_NAME;

  return { theme, customThemes };
}

function loadLegacyThemeState(): PersistedThemeState | null {
  if (typeof window === "undefined") return null;

  try {
    const rawThemeName = localStorage.getItem(LEGACY_THEME_KEY);
    const rawCustomThemes = localStorage.getItem(LEGACY_CUSTOM_THEMES_KEY);
    const customThemes = rawCustomThemes
      ? parseThemePalettes(JSON.parse(rawCustomThemes))
      : [];
    const theme = resolveThemeName(rawThemeName ?? DEFAULT_THEME_NAME, customThemes);

    return { theme, customThemes };
  } catch {
    return null;
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME_NAME,
      customThemes: [],
      setTheme: (name) =>
        set((state) => {
          if (!hasTheme(name, state.customThemes)) return state;
          if (state.theme === name) return state;
          return { theme: name };
        }),
      upsertCustomTheme: (palette) =>
        set((state) => {
          const parsedPalette = parseThemePalette(palette);
          if (!parsedPalette) return state;

          return {
            customThemes: [
              ...state.customThemes.filter(
                (theme) => theme.name !== parsedPalette.name,
              ),
              parsedPalette,
            ],
          };
        }),
      removeCustomTheme: (name) =>
        set((state) => {
          const customThemes = state.customThemes.filter(
            (theme) => theme.name !== name,
          );
          if (customThemes.length === state.customThemes.length) return state;

          return {
            customThemes,
            theme: resolveThemeName(state.theme, customThemes),
          };
        }),
    }),
    {
      name: "terminal-theme-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        customThemes: state.customThemes,
      }),
      merge: (persistedState, currentState) => {
        const parsedPersisted = parsePersistedThemeState(persistedState);
        if (parsedPersisted) {
          return { ...currentState, ...parsedPersisted };
        }

        const legacyState = loadLegacyThemeState();
        if (!legacyState) return currentState;
        return { ...currentState, ...legacyState };
      },
    },
  ),
);
