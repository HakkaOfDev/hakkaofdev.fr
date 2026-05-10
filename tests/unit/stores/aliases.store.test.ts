import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { expandAlias, useAliasesStore } from "@/stores/aliases.store";

describe("aliases store", () => {
  beforeEach(() => {
    useAliasesStore.getState().clearAliases();
  });

  afterEach(() => {
    useAliasesStore.getState().clearAliases();
  });

  describe("setAlias", () => {
    it("stores a valid alias", () => {
      const result = useAliasesStore.getState().setAlias("hi", "about");
      expect(result.ok).toBe(true);
      expect(useAliasesStore.getState().aliases).toEqual({ hi: "about" });
    });

    it("normalizes name to lowercase", () => {
      useAliasesStore.getState().setAlias("HELLO", "about");
      expect(useAliasesStore.getState().aliases.hello).toBe("about");
    });

    it("rejects names with invalid characters", () => {
      const result = useAliasesStore.getState().setAlias("123foo", "about");
      expect(result).toEqual({ ok: false, reason: "invalid-name" });
    });

    it("rejects reserved names", () => {
      const result = useAliasesStore.getState().setAlias("help", "about");
      expect(result).toEqual({ ok: false, reason: "reserved-name" });
    });

    it("rejects empty values", () => {
      const result = useAliasesStore.getState().setAlias("hi", "   ");
      expect(result).toEqual({ ok: false, reason: "empty-value" });
    });

    it("rejects values that are too long", () => {
      const long = "x".repeat(500);
      const result = useAliasesStore.getState().setAlias("hi", long);
      expect(result).toEqual({ ok: false, reason: "value-too-long" });
    });

    it("rejects self-references", () => {
      const result = useAliasesStore.getState().setAlias("hi", "hi --bye");
      expect(result).toEqual({ ok: false, reason: "self-reference" });
    });

    it("enforces the max alias count", () => {
      for (let i = 0; i < 32; i += 1) {
        useAliasesStore.getState().setAlias(`a${i}`, "about");
      }
      const result = useAliasesStore.getState().setAlias("overflow", "about");
      expect(result).toEqual({ ok: false, reason: "limit-reached" });
    });

    it("allows updating an existing alias even at the cap", () => {
      for (let i = 0; i < 32; i += 1) {
        useAliasesStore.getState().setAlias(`a${i}`, "about");
      }
      const result = useAliasesStore.getState().setAlias("a0", "skills");
      expect(result.ok).toBe(true);
      expect(useAliasesStore.getState().aliases.a0).toBe("skills");
    });
  });

  describe("removeAlias", () => {
    it("returns false when alias does not exist", () => {
      expect(useAliasesStore.getState().removeAlias("missing")).toBe(false);
    });

    it("removes an existing alias", () => {
      useAliasesStore.getState().setAlias("hi", "about");
      expect(useAliasesStore.getState().removeAlias("hi")).toBe(true);
      expect(useAliasesStore.getState().aliases).toEqual({});
    });
  });

  describe("clearAliases", () => {
    it("removes all aliases", () => {
      useAliasesStore.getState().setAlias("a", "about");
      useAliasesStore.getState().setAlias("b", "skills");
      useAliasesStore.getState().clearAliases();
      expect(useAliasesStore.getState().aliases).toEqual({});
    });
  });
});

describe("expandAlias", () => {
  it("returns input unchanged when no aliases", () => {
    expect(expandAlias("about", {})).toBe("about");
  });

  it("expands a simple alias", () => {
    expect(expandAlias("hi", { hi: "about" })).toBe("about");
  });

  it("preserves remaining tokens after the head", () => {
    expect(expandAlias("g read", { g: "guestbook" })).toBe("guestbook read");
  });

  it("expands recursively until stable", () => {
    expect(expandAlias("a", { a: "b", b: "c", c: "about" })).toBe("about");
  });

  it("breaks alias cycles safely", () => {
    const result = expandAlias("a", { a: "b", b: "a" });
    // Should not infinitely recurse — must terminate
    expect(typeof result).toBe("string");
  });

  it("returns input as-is for empty input", () => {
    expect(expandAlias("", { hi: "about" })).toBe("");
  });
});
