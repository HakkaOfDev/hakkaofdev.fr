import type { TerminalShortcut } from "@/types/terminal";

export const CLOSE_MESSAGES = [
  "Nice try! You can't close me.",
  "I'm not going anywhere. Try 'help' instead!",
  "Nope. This terminal has trust issues with close buttons.",
  "Error 418: I'm a teapot, not a closable window.",
  "sudo rm -rf / ? Yeah... no.",
  "You really thought that would work?",
  "Close me? In this economy?",
  "I'm built different. Try 'contact' instead.",
];

export const TERMINAL_KEYBOARD_SHORTCUTS: ReadonlyArray<TerminalShortcut> = [
  { keys: ["Enter"], description: "Run a command" },
  { keys: ["Tab"], description: "Autocomplete current input" },
  { keys: ["↑", "↓"], description: "History and suggestions" },
  { keys: ["Ctrl", "L"], isCombined: true, description: "Clear output" },
  { keys: ["Ctrl", "R"], isCombined: true, description: "Reset terminal" },
  { keys: ["Ctrl", "F"], isCombined: true, description: "Toggle search" },
  { keys: ["Ctrl", "+"], isCombined: true, description: "Increase font size" },
  { keys: ["Ctrl", "-"], isCombined: true, description: "Decrease font size" },
];
