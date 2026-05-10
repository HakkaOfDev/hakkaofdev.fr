import { describe, expect, it } from "vitest";
import { ALL_COMMANDS } from "@/lib/command-descriptors";
import {
  buildSuggestionPool,
  calculateTabCompletion,
  filterSuggestions,
  getDefaultSuggestions,
  getSubcommandSuggestions,
  longestCommonPrefix,
} from "@/lib/utils/suggestions.utils";

describe("longestCommonPrefix", () => {
  it("returns empty for empty list", () => {
    expect(longestCommonPrefix([])).toBe("");
  });
  it("returns the only item when one given", () => {
    expect(longestCommonPrefix(["theme"])).toBe("theme");
  });
  it("computes the LCP across items", () => {
    expect(longestCommonPrefix(["theme list", "theme set"])).toBe("theme ");
    expect(longestCommonPrefix(["projects", "profile"])).toBe("pro");
  });
  it("returns empty string when no common prefix", () => {
    expect(longestCommonPrefix(["abc", "def"])).toBe("");
  });
});

describe("buildSuggestionPool", () => {
  it("produces suggestions from ALL_COMMANDS sorted alphabetically", () => {
    const pool = buildSuggestionPool();
    expect(pool.length).toBeGreaterThanOrEqual(ALL_COMMANDS.length);
    for (let i = 1; i < pool.length; i += 1) {
      expect(
        pool[i].value.localeCompare(pool[i - 1].value),
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it("includes user aliases that don't conflict with built-ins", () => {
    const pool = buildSuggestionPool({ hi: "about" });
    expect(pool.some((s) => s.value === "hi")).toBe(true);
  });

  it("never overrides a built-in command with an alias", () => {
    const pool = buildSuggestionPool({ help: "about" });
    const helpEntry = pool.find((s) => s.value === "help");
    expect(helpEntry?.description).toBeUndefined();
  });
});

describe("filterSuggestions", () => {
  const pool = buildSuggestionPool();

  it("returns nothing for empty query", () => {
    expect(filterSuggestions("", pool)).toEqual([]);
  });

  it("filters by prefix", () => {
    const result = filterSuggestions("the", pool);
    expect(result.length).toBeGreaterThan(0);
    for (const s of result) {
      expect(s.value.startsWith("the")).toBe(true);
    }
  });

  it("returns subcommand suggestions when prefix matches", () => {
    const result = filterSuggestions("spotify", pool);
    expect(result.some((s) => s.value === "spotify")).toBe(true);
    expect(result.some((s) => s.value === "spotify now")).toBe(true);
  });

  it("returns matching subcommands when typing prefix + partial", () => {
    const result = filterSuggestions("spotify n", pool);
    expect(result.every((s) => s.value.startsWith("spotify "))).toBe(true);
    expect(result.some((s) => s.value === "spotify now")).toBe(true);
  });
});

describe("getDefaultSuggestions", () => {
  const pool = buildSuggestionPool();
  it("filters by prefix", () => {
    const result = getDefaultSuggestions("ab", pool);
    expect(result.every((s) => s.value.startsWith("ab"))).toBe(true);
  });
});

describe("getSubcommandSuggestions", () => {
  const pool = buildSuggestionPool();
  it("returns null for non-prefix queries", () => {
    expect(getSubcommandSuggestions("about", pool)).toBeNull();
  });
});

describe("calculateTabCompletion", () => {
  const pool = buildSuggestionPool();

  it("does nothing on empty input", () => {
    expect(calculateTabCompletion("", pool)).toEqual({ type: "no_action" });
  });

  it("adds a space when query equals a subcommand prefix", () => {
    const result = calculateTabCompletion("spotify", []);
    expect(result).toEqual({ type: "add_space", value: "spotify " });
  });

  it("completes single matches", () => {
    const filtered = filterSuggestions("abou", pool);
    const result = calculateTabCompletion("abou", filtered);
    expect(result).toEqual({ type: "complete_single", value: "about" });
  });

  it("completes the longest common prefix on ambiguous input", () => {
    const filtered = filterSuggestions("the", pool);
    const result = calculateTabCompletion("the", filtered);
    expect(result.type).toBe("complete_prefix");
    if (result.type === "complete_prefix") {
      expect(result.value.startsWith("the")).toBe(true);
      expect(result.value.length).toBeGreaterThan("the".length);
    }
  });

  it("returns no_action when nothing to complete", () => {
    const result = calculateTabCompletion("zzzzzz", []);
    expect(result.type).toBe("no_action");
  });
});
