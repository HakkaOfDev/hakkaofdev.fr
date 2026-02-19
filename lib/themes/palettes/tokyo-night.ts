import type { ThemePalette } from "@/types/theme";

export const tokyoNight: ThemePalette = {
  name: "tokyo-night",
  label: "Tokyo Night",
  isDark: true,
  colors: {
    background: "oklch(0.20 0.03 265)",
    foreground: "oklch(0.88 0.03 250)",
    muted: "oklch(0.28 0.03 265)",
    "muted-foreground": "oklch(0.67 0.04 255)",
    accent: "oklch(0.30 0.04 265)",
    "accent-foreground": "oklch(0.88 0.03 250)",
    destructive: "oklch(0.65 0.22 20)",
    border: "oklch(0.35 0.03 265)",
    input: "oklch(0.32 0.03 265)",
    ring: "oklch(0.75 0.13 250)",
    primary: "oklch(0.72 0.12 230)",
    secondary: "oklch(0.78 0.15 160)",
    tertiary: "oklch(0.70 0.18 290)",
    quaternary: "oklch(0.72 0.18 40)",
    quinary: "oklch(0.70 0.20 350)",
  },
};
