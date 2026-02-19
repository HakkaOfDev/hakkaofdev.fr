import type { ThemePalette } from "@/types/theme";

export const monokai: ThemePalette = {
  name: "monokai",
  label: "Monokai",
  isDark: true,
  colors: {
    background: "oklch(0.22 0.01 80)",
    foreground: "oklch(0.93 0.01 100)",
    muted: "oklch(0.30 0.01 80)",
    "muted-foreground": "oklch(0.70 0.03 80)",
    accent: "oklch(0.30 0.02 80)",
    "accent-foreground": "oklch(0.93 0.01 100)",
    destructive: "oklch(0.65 0.25 15)",
    border: "oklch(0.38 0.02 80)",
    input: "oklch(0.35 0.02 80)",
    ring: "oklch(0.80 0.15 130)",
    primary: "oklch(0.70 0.17 200)",
    secondary: "oklch(0.80 0.15 130)",
    tertiary: "oklch(0.72 0.18 310)",
    quaternary: "oklch(0.72 0.20 50)",
    quinary: "oklch(0.65 0.25 15)",
  },
};
