import type { Command } from "./command";

export type TerminalFontId =
  | "system"
  | "jetbrains"
  | "fira"
  | "source"
  | "montserrat";

export type TerminalFontOption = {
  id: TerminalFontId;
  label: string;
  stack: string;
};

export type TerminalShortcut = {
  keys: string[];
  description: string;
  isCombined?: boolean;
};

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export type CommandSession = {
  id: string;
  name: string;
  showWelcome: boolean;
  commands: Command[];
};

export type SessionTab = {
  id: string;
  name: string;
  commandCount: number;
};

export type SessionSnapshot = {
  id: string;
  showWelcome: boolean;
  commands: Command[];
};

export type StoredSessionState = {
  activeSessionId: string;
  sessions: Array<{
    id: string;
    name: string;
    showWelcome: boolean;
    commands: Array<{
      id: string;
      input: string;
      timestamp: string;
    }>;
  }>;
};

export type StoredTerminalPreferences = {
  fontScale: number;
  fontFamily: TerminalFontId;
  scrollbackLimit: number;
};
