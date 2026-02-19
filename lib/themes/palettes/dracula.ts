import type { ThemePalette } from "@/types/theme";

export const dracula: ThemePalette = {
  name: "dracula",
  label: "Dracula",
  isDark: true,
  colors: {
    background: "oklch(0.22 0.02 280)",
    foreground: "oklch(0.95 0.01 100)",
    muted: "oklch(0.30 0.02 280)",
    "muted-foreground": "oklch(0.70 0.04 250)",
    accent: "oklch(0.30 0.03 280)",
    "accent-foreground": "oklch(0.95 0.01 100)",
    destructive: "oklch(0.65 0.25 15)",
    border: "oklch(0.38 0.03 280)",
    input: "oklch(0.35 0.03 280)",
    ring: "oklch(0.75 0.18 310)",
    primary: "oklch(0.72 0.15 195)",
    secondary: "oklch(0.80 0.17 130)",
    tertiary: "oklch(0.75 0.18 310)",
    quaternary: "oklch(0.72 0.20 30)",
    quinary: "oklch(0.65 0.25 15)",
  },
};
