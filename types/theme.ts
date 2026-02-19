/**
 * All semantic color tokens that every theme must define.
 * Values are CSS color strings (OKLCH, hex, rgb, hsl all supported).
 * OKLCH is recommended for perceptually uniform color manipulation.
 *
 * 5 accent colors replace the old chart-1..5 system:
 *   primary    – main accent (links, caret, active states)
 *   secondary  – secondary accent (profile, star, spotify)
 *   tertiary   – third accent (spotify group, purple tones)
 *   quaternary – fourth accent (theme group, orange tones)
 *   quinary    – fifth accent (guestbook group, rose tones)
 */
export type ThemeColors = {
  background: string;
  foreground: string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  quinary: string;
};

export const THEME_COLOR_KEYS = [
  "background",
  "foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
] as const satisfies readonly (keyof ThemeColors)[];

export type ThemePalette = {
  /** Unique machine-readable id (e.g. "dracula", "default"). */
  name: string;
  /** Human-readable display name (e.g. "Dracula", "Default"). */
  label: string;
  /** Whether Tailwind's `.dark` class should be applied. */
  isDark: boolean;
  colors: ThemeColors;
};

/**
 * Text/background pairs that must pass WCAG AA contrast checks.
 * `level` controls the required ratio: "normal" = 4.5:1, "large" = 3:1.
 */
export type ContrastPair = {
  fg: keyof ThemeColors;
  bg: keyof ThemeColors;
  level: "normal" | "large";
  label: string;
};

export const REQUIRED_CONTRAST_PAIRS: ContrastPair[] = [
  { fg: "foreground", bg: "background", level: "normal", label: "Body text" },
  {
    fg: "muted-foreground",
    bg: "background",
    level: "normal",
    label: "Muted text on background",
  },
  {
    fg: "muted-foreground",
    bg: "muted",
    level: "normal",
    label: "Muted text on muted bg",
  },
  {
    fg: "accent-foreground",
    bg: "accent",
    level: "normal",
    label: "Accent text on accent bg",
  },
  {
    fg: "destructive",
    bg: "background",
    level: "normal",
    label: "Destructive text",
  },
  { fg: "primary", bg: "background", level: "large", label: "Primary accent" },
  {
    fg: "secondary",
    bg: "background",
    level: "large",
    label: "Secondary accent",
  },
  {
    fg: "tertiary",
    bg: "background",
    level: "large",
    label: "Tertiary accent",
  },
  {
    fg: "quaternary",
    bg: "background",
    level: "large",
    label: "Quaternary accent",
  },
  {
    fg: "quinary",
    bg: "background",
    level: "large",
    label: "Quinary accent",
  },
];

export type ThemeCreateStep = "input" | "success" | "error";
export type ThemeCreateMode = "visual" | "json";
