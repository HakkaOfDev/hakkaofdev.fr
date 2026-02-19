import type { ThemePalette } from "@/types/theme";
import { catppuccinLatte } from "./catppuccin-latte";
import { defaultDark } from "./default";
import { dracula } from "./dracula";
import { githubLight } from "./github-light";
import { gruvbox } from "./gruvbox";
import { monokai } from "./monokai";
import { nord } from "./nord";
import { rosePineDawn } from "./rose-pine-dawn";
import { solarized } from "./solarized";
import { tokyoNight } from "./tokyo-night";

export const BUILTIN_THEMES: ThemePalette[] = [
  defaultDark,
  catppuccinLatte,
  githubLight,
  rosePineDawn,
  dracula,
  nord,
  solarized,
  monokai,
  gruvbox,
  tokyoNight,
];

export const BUILTIN_THEME_MAP = new Map(
  BUILTIN_THEMES.map((t) => [t.name, t]),
);

export {
  catppuccinLatte,
  defaultDark,
  dracula,
  githubLight,
  gruvbox,
  monokai,
  nord,
  rosePineDawn,
  solarized,
  tokyoNight,
};
