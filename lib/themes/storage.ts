"use client";

import { useThemeStore } from "@/stores/theme.store";
import type { ThemePalette } from "@/types/theme";

export function getStoredThemeName(): string | null {
  const { theme } = useThemeStore.getState();
  return theme ?? null;
}

export function storeThemeName(name: string): void {
  useThemeStore.getState().setTheme(name);
}

export function getCustomThemes(): ThemePalette[] {
  return useThemeStore.getState().customThemes;
}

export function storeCustomTheme(palette: ThemePalette): void {
  useThemeStore.getState().upsertCustomTheme(palette);
}

export function getThemeJSON(name: string): string | null {
  const theme = useThemeStore
    .getState()
    .customThemes.find((palette) => palette.name === name);
  return theme ? JSON.stringify(theme, null, 2) : null;
}

export function removeCustomTheme(name: string): void {
  useThemeStore.getState().removeCustomTheme(name);
}
