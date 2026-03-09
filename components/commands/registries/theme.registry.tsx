"use client";

import type { ReactNode } from "react";
import { CThemeList } from "../renders/theme/CThemeList";
import { CThemePreview } from "../renders/theme/CThemePreview";
import { CThemeSet } from "../renders/theme/CThemeSet";
import { CThemeValidate } from "../renders/theme/CThemeValidate";
import { CThemeCreate } from "../renders/theme/create/CThemeCreate";
import { registerDynamicParamCommand } from "./dynamic-param.registry";

export type { ThemeCommandDescriptor } from "../../../lib/command-descriptors";
export { THEME_COMMANDS } from "../../../lib/command-descriptors";

type ThemeCommandRenderer = {
  list: () => ReactNode;
  set: (name: string) => ReactNode;
  preview: (name: string) => ReactNode;
  create: () => ReactNode;
  validate: () => ReactNode;
};

export const THEME_COMMAND_RENDERERS: ThemeCommandRenderer = {
  list: () => <CThemeList />,
  set: (name: string) => <CThemeSet name={name} />,
  preview: (name: string) => <CThemePreview name={name} />,
  create: () => <CThemeCreate />,
  validate: () => <CThemeValidate />,
};

/**
 * Get all available theme names for autocomplete.
 * This function is called lazily when the user types "theme set " or "theme preview ".
 */
export function getAvailableThemeNames(): string[] {
  // Must run in browser because this command registry is interactive.
  if (typeof window === "undefined") return [];

  try {
    // Import themes dynamically to avoid circular dependencies
    const { BUILTIN_THEMES } = require("@/lib/themes/palettes");
    const { getCustomThemes } = require("@/lib/themes/storage");

    const customThemes = getCustomThemes();
    const allThemes = [...BUILTIN_THEMES, ...customThemes];

    const themeNames = allThemes.map((t) => t.name).sort();

    return themeNames;
  } catch (error) {
    console.error("Error getting theme names:", error);
    return [];
  }
}

// Register dynamic parameter commands for theme
registerDynamicParamCommand({
  pattern: "theme set",
  paramProvider: getAvailableThemeNames,
  group: "Theme",
});

registerDynamicParamCommand({
  pattern: "theme preview",
  paramProvider: getAvailableThemeNames,
  group: "Theme",
});
