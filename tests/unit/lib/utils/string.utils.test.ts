import { describe, expect, it } from "vitest";
import { cleanText, codepointLength } from "@/lib/utils/string.utils";

describe("codepointLength", () => {
  it("returns 0 for empty string", () => {
    expect(codepointLength("")).toBe(0);
  });

  it("counts ASCII characters", () => {
    expect(codepointLength("hello")).toBe(5);
  });

  it("counts unicode codepoints (emoji as 1)", () => {
    expect(codepointLength("a😀b")).toBe(3);
    expect(codepointLength("👨‍👩‍👧")).toBeGreaterThan(0);
  });

  it("counts multi-byte CJK characters as 1 each", () => {
    expect(codepointLength("日本語")).toBe(3);
  });
});

describe("cleanText", () => {
  it("returns empty string for non-string input", () => {
    expect(cleanText(undefined, 10)).toBe("");
    expect(cleanText(null, 10)).toBe("");
    expect(cleanText(42, 10)).toBe("");
    expect(cleanText({}, 10)).toBe("");
  });

  it("trims surrounding whitespace", () => {
    expect(cleanText("   hello   ", 100)).toBe("hello");
  });

  it("collapses inner whitespace runs to a single space", () => {
    expect(cleanText("hello\n\t   world", 100)).toBe("hello world");
  });

  it("truncates to maxLength code points", () => {
    expect(cleanText("abcdef", 3)).toBe("abc");
  });

  it("respects unicode boundaries when truncating", () => {
    expect(cleanText("a😀bc", 2)).toBe("a😀");
  });

  it("returns empty string when input is only whitespace", () => {
    expect(cleanText("   ", 10)).toBe("");
  });
});
