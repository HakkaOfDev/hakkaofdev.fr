import type { ThemePalette } from "@/types/theme";

const THEME_KEY = "terminal-theme";
const CUSTOM_THEMES_KEY = "terminal-custom-themes";

export function getStoredThemeName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

export function storeThemeName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_KEY, name);
  } catch {}
}

export function getCustomThemes(): ThemePalette[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_THEMES_KEY);
    return raw ? (JSON.parse(raw) as ThemePalette[]) : [];
  } catch {
    return [];
  }
}

export function storeCustomTheme(palette: ThemePalette): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomThemes().filter((t) => t.name !== palette.name);
    existing.push(palette);
    localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(existing));

    // Also store a formatted JSON version for easy export
    const themeJsonKey = `terminal-theme-json-${palette.name}`;
    localStorage.setItem(themeJsonKey, JSON.stringify(palette, null, 2));
  } catch {}
}

export function getThemeJSON(name: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const themeJsonKey = `terminal-theme-json-${name}`;
    return localStorage.getItem(themeJsonKey);
  } catch {
    return null;
  }
}

export function removeCustomTheme(name: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomThemes().filter((t) => t.name !== name);
    localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(existing));

    // Also remove the JSON export
    const themeJsonKey = `terminal-theme-json-${name}`;
    localStorage.removeItem(themeJsonKey);
  } catch {}
}
