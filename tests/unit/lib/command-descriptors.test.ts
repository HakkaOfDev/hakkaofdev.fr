import { describe, expect, it } from "vitest";
import {
  ALL_COMMANDS,
  COMMAND_GROUPS,
  COMMANDS,
  GROUP_META,
  GUESTBOOK_COMMANDS,
  getCommandsByGroup,
  LANG_COMMANDS,
  SPOTIFY_COMMANDS,
  STATS_COMMANDS,
  SUBCOMMAND_PREFIXES,
  THEME_COMMANDS,
} from "@/lib/command-descriptors";

describe("command descriptors", () => {
  it("base COMMANDS contains expected entry points", () => {
    const names = COMMANDS.map((c) => c.command);
    for (const expected of [
      "help",
      "clear",
      "reset",
      "about",
      "skills",
      "guestbook",
      "spotify",
      "theme",
      "lang",
      "alias",
      "history",
      "man",
    ]) {
      expect(names).toContain(expected);
    }
  });

  it("each base command has a slug and a known group", () => {
    const groups = new Set(COMMAND_GROUPS.map((g) => g.group));
    for (const cmd of COMMANDS) {
      expect(cmd.slug).toBeTruthy();
      expect(groups.has(cmd.group)).toBe(true);
    }
  });

  it("ALL_COMMANDS expands sub-commands", () => {
    const names = ALL_COMMANDS.map((c) => c.command);
    expect(names).toContain("guestbook read");
    expect(names).toContain("guestbook sign");
    expect(names).toContain("spotify now");
    expect(names).toContain("theme list");
    expect(names).toContain("lang set");
    expect(names).toContain("alias remove");
  });

  it("ALL_COMMANDS has the right total length", () => {
    const expected =
      COMMANDS.length +
      GUESTBOOK_COMMANDS.length +
      SPOTIFY_COMMANDS.length +
      THEME_COMMANDS.length +
      LANG_COMMANDS.length +
      STATS_COMMANDS.length +
      2; // alias remove + alias clear
    expect(ALL_COMMANDS.length).toBe(expected);
  });

  it("GROUP_META resolves to the same metadata as COMMAND_GROUPS", () => {
    for (const meta of COMMAND_GROUPS) {
      expect(GROUP_META[meta.group]).toEqual(meta);
    }
  });

  it("SUBCOMMAND_PREFIXES match the registered namespaces", () => {
    expect([...SUBCOMMAND_PREFIXES].sort()).toEqual(
      ["alias", "guestbook", "lang", "spotify", "stats", "theme"].sort(),
    );
  });
});

describe("getCommandsByGroup", () => {
  const grouped = getCommandsByGroup();

  it("preserves the COMMAND_GROUPS order", () => {
    expect(grouped.map((g) => g.meta.group)).toEqual(
      COMMAND_GROUPS.map((g) => g.group),
    );
  });

  it("sorts commands alphabetically within each group", () => {
    for (const { commands } of grouped) {
      const names = commands.map((c) => c.command);
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(sorted);
    }
  });

  it("only includes base commands (no subcommand expansion)", () => {
    const expanded = grouped.flatMap((g) => g.commands);
    for (const cmd of expanded) {
      expect(cmd.command).not.toContain(" ");
    }
  });
});
