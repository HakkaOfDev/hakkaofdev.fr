import { describe, expect, it } from "vitest";
import { normalizeWebsite } from "@/lib/utils/url.utils";

describe("normalizeWebsite", () => {
  it("returns null for empty input", () => {
    expect(normalizeWebsite("")).toBeNull();
  });

  it("prepends https:// when no scheme is given", () => {
    expect(normalizeWebsite("example.com")).toBe("https://example.com/");
  });

  it("preserves http scheme", () => {
    expect(normalizeWebsite("http://example.com")).toBe("http://example.com/");
  });

  it("preserves https scheme", () => {
    expect(normalizeWebsite("https://example.com/path")).toBe(
      "https://example.com/path",
    );
  });

  it("returns null for malformed URLs", () => {
    expect(normalizeWebsite("not a url://!!!")).toBeNull();
  });

  it("is case-insensitive about the scheme prefix", () => {
    expect(normalizeWebsite("HTTPS://example.com")).toBe(
      "https://example.com/",
    );
  });
});
