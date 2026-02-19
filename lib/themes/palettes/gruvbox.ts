import type { ThemePalette } from "@/types/theme";

export const gruvbox: ThemePalette = {
  name: "gruvbox",
  label: "Gruvbox",
  isDark: true,
  colors: {
    background: "oklch(0.24 0.02 60)",
    foreground: "oklch(0.88 0.06 85)",
    muted: "oklch(0.32 0.03 60)",
    "muted-foreground": "oklch(0.70 0.05 75)",
    accent: "oklch(0.35 0.04 60)",
    "accent-foreground": "oklch(0.88 0.06 85)",
    destructive: "oklch(0.67 0.22 25)",
    border: "oklch(0.40 0.04 65)",
    input: "oklch(0.37 0.03 65)",
    ring: "oklch(0.75 0.14 60)",
    primary: "oklch(0.68 0.14 210)",
    secondary: "oklch(0.78 0.16 140)",
    tertiary: "oklch(0.68 0.16 310)",
    quaternary: "oklch(0.72 0.18 55)",
    quinary: "oklch(0.65 0.20 15)",
  },
};
