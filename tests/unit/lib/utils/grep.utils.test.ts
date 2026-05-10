import { describe, expect, it } from "vitest";
import { filterByGrep, matchesGrep } from "@/lib/utils/grep.utils";

describe("matchesGrep", () => {
  it("returns true when pattern is empty", () => {
    expect(matchesGrep("anything", "")).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(matchesGrep("Hello World", "hello")).toBe(true);
    expect(matchesGrep("Hello World", "WORLD")).toBe(true);
  });

  it("returns false when no match", () => {
    expect(matchesGrep("hello", "xyz")).toBe(false);
  });
});

describe("filterByGrep", () => {
  const items = [
    { id: 1, name: "spotify now", tags: ["music", "playing"] },
    { id: 2, name: "theme set", tags: ["color"] },
    { id: 3, name: "guestbook read", tags: [] },
  ];

  it("returns a copy of items when pattern is empty", () => {
    const result = filterByGrep(items, "", (i) => i.name);
    expect(result).toEqual(items);
    expect(result).not.toBe(items);
  });

  it("filters by string accessor", () => {
    expect(filterByGrep(items, "spot", (i) => i.name)).toHaveLength(1);
    expect(filterByGrep(items, "theme", (i) => i.name)[0].id).toBe(2);
  });

  it("filters by array accessor across multiple fields", () => {
    expect(
      filterByGrep(items, "music", (i) => [i.name, ...i.tags]),
    ).toHaveLength(1);
  });

  it("ignores empty / falsy projected fields", () => {
    expect(filterByGrep(items, "", (i) => i.tags)).toEqual(items);
    expect(
      filterByGrep(items, "color", (i) => [i.name, ...i.tags]),
    ).toHaveLength(1);
  });

  it("is case-insensitive", () => {
    expect(filterByGrep(items, "SPOTIFY", (i) => i.name)).toHaveLength(1);
  });
});
