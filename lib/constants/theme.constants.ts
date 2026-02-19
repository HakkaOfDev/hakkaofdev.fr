import type { ThemeColors } from "@/types/theme";

export const COLOR_LABELS: Record<keyof ThemeColors, string> = {
  background: "Background",
  foreground: "Foreground",
  muted: "Muted",
  "muted-foreground": "Muted Foreground",
  accent: "Accent",
  "accent-foreground": "Accent Foreground",
  destructive: "Destructive",
  border: "Border",
  input: "Input",
  ring: "Ring",
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
  quaternary: "Quaternary",
  quinary: "Quinary",
};

export const DEFAULT_COLORS: ThemeColors = {
  background: "#0d1117",
  foreground: "#c9d1d9",
  muted: "#161b22",
  "muted-foreground": "#8b949e",
  accent: "#1f6feb",
  "accent-foreground": "#ffffff",
  destructive: "#f85149",
  border: "#30363d",
  input: "#0d1117",
  ring: "#1f6feb",
  primary: "#58a6ff",
  secondary: "#56d364",
  tertiary: "#d2a8ff",
  quaternary: "#ffa657",
  quinary: "#ff7b72",
};
