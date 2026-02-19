import type { ThemePalette } from "@/types/theme";

export const solarized: ThemePalette = {
  name: "solarized",
  label: "Solarized Dark",
  isDark: true,
  colors: {
    background: "oklch(0.20 0.02 220)",
    foreground: "oklch(0.82 0.04 195)",
    muted: "oklch(0.27 0.02 220)",
    "muted-foreground": "oklch(0.66 0.04 195)",
    accent: "oklch(0.27 0.04 220)",
    "accent-foreground": "oklch(0.82 0.04 195)",
    destructive: "oklch(0.66 0.22 25)",
    border: "oklch(0.35 0.03 215)",
    input: "oklch(0.32 0.03 215)",
    ring: "oklch(0.65 0.14 230)",
    primary: "oklch(0.65 0.14 230)",
    secondary: "oklch(0.70 0.16 150)",
    tertiary: "oklch(0.60 0.18 310)",
    quaternary: "oklch(0.68 0.18 55)",
    quinary: "oklch(0.65 0.20 5)",
  },
};
