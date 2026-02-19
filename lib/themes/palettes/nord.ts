import type { ThemePalette } from "@/types/theme";

export const nord: ThemePalette = {
  name: "nord",
  label: "Nord",
  isDark: true,
  colors: {
    background: "oklch(0.25 0.02 240)",
    foreground: "oklch(0.91 0.01 230)",
    muted: "oklch(0.32 0.02 240)",
    "muted-foreground": "oklch(0.72 0.03 230)",
    accent: "oklch(0.35 0.03 240)",
    "accent-foreground": "oklch(0.91 0.01 230)",
    destructive: "oklch(0.65 0.18 15)",
    border: "oklch(0.40 0.02 240)",
    input: "oklch(0.37 0.02 240)",
    ring: "oklch(0.75 0.10 220)",
    primary: "oklch(0.72 0.10 220)",
    secondary: "oklch(0.78 0.12 170)",
    tertiary: "oklch(0.70 0.12 280)",
    quaternary: "oklch(0.72 0.15 30)",
    quinary: "oklch(0.72 0.15 350)",
  },
};
