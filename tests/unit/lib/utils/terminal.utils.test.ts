import { describe, expect, it } from "vitest";
import {
  clamp,
  clampFontScale,
  clampScrollbackLimit,
  createId,
  createSession,
  createSessionName,
  isTerminalFontId,
  MAX_FONT_SCALE,
  MAX_SCROLLBACK_LIMIT,
  MIN_FONT_SCALE,
  MIN_SCROLLBACK_LIMIT,
  normalizeDimension,
  normalizeTabName,
  sanitizeStoredSessions,
} from "@/lib/utils/terminal.utils";
import type { CommandSession } from "@/types/terminal";

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });
  it("clamps below minimum", () => {
    expect(clamp(-10, 0, 100)).toBe(0);
  });
  it("clamps above maximum", () => {
    expect(clamp(200, 0, 100)).toBe(100);
  });
});

describe("clampFontScale", () => {
  it("clamps below minimum", () => {
    expect(clampFontScale(MIN_FONT_SCALE - 50)).toBe(MIN_FONT_SCALE);
  });
  it("clamps above maximum", () => {
    expect(clampFontScale(MAX_FONT_SCALE + 50)).toBe(MAX_FONT_SCALE);
  });
  it("rounds fractional values", () => {
    expect(clampFontScale(100.4)).toBe(100);
    expect(clampFontScale(100.6)).toBe(101);
  });
});

describe("clampScrollbackLimit", () => {
  it("clamps to allowed range", () => {
    expect(clampScrollbackLimit(0)).toBe(MIN_SCROLLBACK_LIMIT);
    expect(clampScrollbackLimit(9999)).toBe(MAX_SCROLLBACK_LIMIT);
  });
});

describe("normalizeDimension", () => {
  it("returns null for invalid values", () => {
    expect(normalizeDimension(null, 100)).toBeNull();
    expect(normalizeDimension(undefined, 100)).toBeNull();
    expect(normalizeDimension(Number.NaN, 100)).toBeNull();
    expect(normalizeDimension(0, 100)).toBeNull();
    expect(normalizeDimension(-5, 100)).toBeNull();
  });

  it("returns at least the minimum", () => {
    expect(normalizeDimension(50, 100)).toBe(100);
  });

  it("rounds and returns valid values above minimum", () => {
    expect(normalizeDimension(150.4, 100)).toBe(150);
  });
});

describe("isTerminalFontId", () => {
  it("matches known font ids", () => {
    expect(isTerminalFontId("system")).toBe(true);
    expect(isTerminalFontId("jetbrains")).toBe(true);
    expect(isTerminalFontId("montserrat")).toBe(true);
  });
  it("rejects unknown ids", () => {
    expect(isTerminalFontId("comic-sans")).toBe(false);
    expect(isTerminalFontId("")).toBe(false);
  });
});

describe("createId", () => {
  it("returns a non-empty string", () => {
    const id = createId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("returns unique values across calls", () => {
    const ids = new Set(Array.from({ length: 50 }, () => createId()));
    expect(ids.size).toBe(50);
  });
});

describe("normalizeTabName", () => {
  it("returns trimmed value when non-empty", () => {
    expect(normalizeTabName("  hello  ", "fallback")).toBe("hello");
  });
  it("returns fallback when empty/whitespace", () => {
    expect(normalizeTabName("   ", "fallback")).toBe("fallback");
    expect(normalizeTabName("", "fallback")).toBe("fallback");
  });
  it("truncates to 32 characters", () => {
    const long = "x".repeat(50);
    expect(normalizeTabName(long, "fallback")).toHaveLength(32);
  });
});

describe("createSessionName", () => {
  it("returns 'root' when no sessions exist", () => {
    expect(createSessionName([])).toBe("root");
  });

  it("returns tab-2 when only root exists", () => {
    const sessions: CommandSession[] = [
      { id: "1", name: "root", showWelcome: true, commands: [] },
    ];
    expect(createSessionName(sessions)).toBe("tab-2");
  });

  it("returns one greater than the highest tab number", () => {
    const sessions: CommandSession[] = [
      { id: "1", name: "root", showWelcome: true, commands: [] },
      { id: "2", name: "tab-2", showWelcome: true, commands: [] },
      { id: "3", name: "tab-7", showWelcome: true, commands: [] },
      { id: "4", name: "custom-name", showWelcome: true, commands: [] },
    ];
    expect(createSessionName(sessions)).toBe("tab-8");
  });
});

describe("createSession", () => {
  it("creates a session with default fields", () => {
    const session = createSession([]);
    expect(session).toMatchObject({
      name: "root",
      showWelcome: true,
      commands: [],
    });
    expect(session.id).toBeTruthy();
  });
});

describe("sanitizeStoredSessions", () => {
  it("returns a fallback session when raw is null", () => {
    const result = sanitizeStoredSessions(null, 100);
    expect(result.sessions).toHaveLength(1);
    expect(result.activeSessionId).toBe(result.sessions[0].id);
  });

  it("returns a fallback session when sessions array is empty", () => {
    const result = sanitizeStoredSessions(
      { sessions: [], activeSessionId: "" },
      100,
    );
    expect(result.sessions).toHaveLength(1);
  });

  it("trims commands to scrollback limit", () => {
    const commands = Array.from({ length: 20 }, (_, i) => ({
      id: `${i}`,
      input: `cmd ${i}`,
      timestamp: new Date().toISOString(),
    }));

    const result = sanitizeStoredSessions(
      {
        sessions: [{ id: "s1", name: "root", showWelcome: false, commands }],
        activeSessionId: "s1",
      },
      5,
    );

    expect(result.sessions[0].commands).toHaveLength(5);
    expect(result.sessions[0].commands[0].input).toBe("cmd 15");
  });

  it("drops invalid commands without crashing", () => {
    const result = sanitizeStoredSessions(
      {
        sessions: [
          {
            id: "s1",
            name: "root",
            showWelcome: true,
            commands: [
              null,
              "string",
              { id: "1", input: "ok", timestamp: new Date().toISOString() },
              { id: "2", input: "no-ts" },
              { id: "3", input: "bad-ts", timestamp: "not a date" },
            ],
          },
        ],
        activeSessionId: "s1",
      } as never,
      100,
    );

    expect(result.sessions[0].commands).toHaveLength(1);
    expect(result.sessions[0].commands[0].id).toBe("1");
  });

  it("falls back to first session when activeSessionId is unknown", () => {
    const result = sanitizeStoredSessions(
      {
        sessions: [
          { id: "real", name: "root", showWelcome: true, commands: [] },
        ],
        activeSessionId: "ghost",
      },
      100,
    );
    expect(result.activeSessionId).toBe("real");
  });

  it("caps the number of stored sessions", () => {
    const sessions = Array.from({ length: 20 }, (_, i) => ({
      id: `s${i}`,
      name: `tab-${i}`,
      showWelcome: false,
      commands: [],
    }));
    const result = sanitizeStoredSessions(
      { sessions, activeSessionId: "s0" },
      100,
    );
    expect(result.sessions.length).toBeLessThanOrEqual(8);
  });
});
