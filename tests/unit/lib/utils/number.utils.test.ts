import { describe, expect, it } from "vitest";
import { parsePositiveInt } from "@/lib/utils/number.utils";

describe("parsePositiveInt", () => {
  it("returns fallback for null", () => {
    expect(parsePositiveInt(null, 10)).toBe(10);
  });

  it("returns fallback for empty string", () => {
    expect(parsePositiveInt("", 7)).toBe(7);
  });

  it("returns fallback for non-numeric input", () => {
    expect(parsePositiveInt("abc", 5)).toBe(5);
  });

  it("returns fallback for zero", () => {
    expect(parsePositiveInt("0", 12)).toBe(12);
  });

  it("returns fallback for negative number", () => {
    expect(parsePositiveInt("-3", 12)).toBe(12);
  });

  it("returns the parsed integer for positive input", () => {
    expect(parsePositiveInt("42", 1)).toBe(42);
  });

  it("parses leading-numeric strings", () => {
    expect(parsePositiveInt("17px", 1)).toBe(17);
  });
});
