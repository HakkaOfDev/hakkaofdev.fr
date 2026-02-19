import type { ThemePalette } from "@/types/theme";

export const defaultDark: ThemePalette = {
  name: "default",
  label: "Default",
  isDark: true,
  colors: {
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    accent: "oklch(0.269 0 0)",
    "accent-foreground": "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.556 0 0)",
    primary: "oklch(0.78 0.14 195)",
    secondary: "oklch(0.8 0.14 75)",
    tertiary: "oklch(0.68 0.18 300)",
    quaternary: "oklch(0.72 0.18 30)",
    quinary: "oklch(0.72 0.22 350)",
  },
};
