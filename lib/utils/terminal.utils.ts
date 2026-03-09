import type { Command } from "@/types";
import type {
  CommandSession,
  StoredSessionState,
  TerminalFontId,
  TerminalFontOption,
} from "@/types/terminal";

export const TERMINAL_PREFERENCES_STORAGE_KEY = "terminal-ui-preferences";
export const SCROLLBACK_STORAGE_KEY = "terminal-scrollback-limit";
export const SESSIONS_STORAGE_KEY = "terminal-command-sessions";

export const DEFAULT_FONT_SCALE = 100;
export const FONT_SCALE_STEP = 10;
export const MIN_FONT_SCALE = 80;
export const MAX_FONT_SCALE = 160;

export const DEFAULT_SCROLLBACK_LIMIT = 100;
export const MIN_SCROLLBACK_LIMIT = 25;
export const MAX_SCROLLBACK_LIMIT = 100;
export const SCROLLBACK_OPTIONS = [25, 50, 75, 100] as const;

export const MAX_SESSIONS = 8;
export const DEFAULT_THEME_NAME = "default";

// Terminal options stay monospace-only; Montserrat is used for the site UI.
export const TERMINAL_FONT_OPTIONS: ReadonlyArray<TerminalFontOption> = [
  {
    id: "system",
    label: "System Mono (OS)",
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    id: "jetbrains",
    label: "JetBrains Mono",
    stack:
      'var(--font-jetbrains-mono), var(--font-fira-code), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    id: "fira",
    label: "Fira Code",
    stack:
      'var(--font-fira-code), var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    id: "source",
    label: "Source Code Pro",
    stack:
      'var(--font-source-code-pro), var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    id: "montserrat",
    label: "Montserrat",
    stack:
      'var(--font-montserrat), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
];

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function clampFontScale(value: number) {
  return clamp(Math.round(value), MIN_FONT_SCALE, MAX_FONT_SCALE);
}

export function clampScrollbackLimit(value: number) {
  return clamp(Math.round(value), MIN_SCROLLBACK_LIMIT, MAX_SCROLLBACK_LIMIT);
}

export function normalizeDimension(
  value: number | null | undefined,
  minimum: number,
): number | null {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return null;
  }
  return Math.max(minimum, Math.round(value));
}

export function isTerminalFontId(value: string): value is TerminalFontId {
  return TERMINAL_FONT_OPTIONS.some((option) => option.id === value);
}

export function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeTabName(value: string, fallback: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 32) : fallback;
}

export function createSessionName(existing: CommandSession[]) {
  if (existing.length === 0) return "root";

  let maxTabNumber = 1;
  for (const session of existing) {
    const match = session.name.match(/^tab-(\d+)$/i);
    if (!match) continue;
    const value = Number(match[1]);
    if (!Number.isNaN(value)) {
      maxTabNumber = Math.max(maxTabNumber, value);
    }
  }

  return `tab-${maxTabNumber + 1}`;
}

export function createSession(existing: CommandSession[]): CommandSession {
  return {
    id: createId(),
    name: createSessionName(existing),
    showWelcome: true,
    commands: [],
  };
}

export function sanitizeStoredSessions(
  raw: StoredSessionState | null,
  scrollbackLimit: number,
) {
  const fallbackSession = createSession([]);

  if (!raw || !Array.isArray(raw.sessions) || raw.sessions.length === 0) {
    return { sessions: [fallbackSession], activeSessionId: fallbackSession.id };
  }

  const sessions = raw.sessions
    .slice(0, MAX_SESSIONS)
    .map((session, index) => {
      const id = typeof session.id === "string" ? session.id : createId();
      const fallbackName = index === 0 ? "root" : `tab-${index + 1}`;
      const name = normalizeTabName(session.name ?? "", fallbackName);
      const showWelcome =
        typeof session.showWelcome === "boolean" ? session.showWelcome : true;
      const rawCommands = Array.isArray(session.commands)
        ? session.commands
        : [];

      const commands = rawCommands
        .map((command) => toCommand(command))
        .filter((command): command is Command => command !== null)
        .slice(-scrollbackLimit);

      return { id, name, showWelcome, commands } satisfies CommandSession;
    })
    .filter((session) => session.id.length > 0);

  if (sessions.length === 0) {
    return { sessions: [fallbackSession], activeSessionId: fallbackSession.id };
  }

  const activeSessionId =
    typeof raw.activeSessionId === "string" &&
    sessions.some((session) => session.id === raw.activeSessionId)
      ? raw.activeSessionId
      : sessions[0].id;

  return { sessions, activeSessionId };
}

function toCommand(raw: unknown): Command | null {
  if (
    !raw ||
    typeof raw !== "object" ||
    !("id" in raw) ||
    !("input" in raw) ||
    !("timestamp" in raw)
  ) {
    return null;
  }

  const id = raw.id;
  const input = raw.input;
  const timestampValue = raw.timestamp;
  if (
    typeof id !== "string" ||
    typeof input !== "string" ||
    typeof timestampValue !== "string"
  ) {
    return null;
  }

  const timestamp = new Date(timestampValue);
  if (Number.isNaN(timestamp.getTime())) return null;

  return { id, input, timestamp };
}
