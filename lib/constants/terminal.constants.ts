import type { TerminalShortcut } from "@/types/terminal";

export const TERMINAL_KEYBOARD_SHORTCUTS: ReadonlyArray<TerminalShortcut> = [
  { keys: ["Enter"], slug: "runCommand" },
  { keys: ["Tab"], slug: "autocomplete" },
  { keys: ["↑", "↓"], slug: "history" },
  { keys: ["Ctrl", "L"], isCombined: true, slug: "clearOutput" },
  { keys: ["Ctrl", "R"], isCombined: true, slug: "resetTerminal" },
  { keys: ["Ctrl", "F"], isCombined: true, slug: "toggleSearch" },
  { keys: ["Ctrl", "+"], isCombined: true, slug: "increaseFontSize" },
  { keys: ["Ctrl", "-"], isCombined: true, slug: "decreaseFontSize" },
];
