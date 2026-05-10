import { describe, expect, it } from "vitest";
import {
  checkPair,
  contrastRatio,
  oklchToSrgb,
  palettePassesAll,
  relativeLuminance,
  validatePalette,
} from "@/lib/themes/contrast";
import type { ThemeColors, ThemePalette } from "@/types/theme";

describe("relativeLuminance", () => {
  it("returns 0 for pure black", () => {
    expect(relativeLuminance(0, 0, 0)).toBeCloseTo(0, 5);
  });
  it("returns 1 for pure white", () => {
    expect(relativeLuminance(1, 1, 1)).toBeCloseTo(1, 5);
  });
  it("is monotonically increasing", () => {
    expect(relativeLuminance(0.5, 0.5, 0.5)).toBeGreaterThan(
      relativeLuminance(0.2, 0.2, 0.2),
    );
  });
});

describe("contrastRatio", () => {
  it("black on white is 21:1", () => {
    expect(contrastRatio([0, 0, 0], [1, 1, 1])).toBeCloseTo(21, 0);
  });
  it("identical colors are 1:1", () => {
    expect(contrastRatio([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])).toBeCloseTo(1, 5);
  });
  it("is symmetric", () => {
    const a = contrastRatio([0, 0, 0], [1, 1, 1]);
    const b = contrastRatio([1, 1, 1], [0, 0, 0]);
    expect(a).toBeCloseTo(b, 5);
  });
});

describe("oklchToSrgb", () => {
  it("converts black", () => {
    const [r, g, b] = oklchToSrgb("oklch(0 0 0)");
    expect(r).toBeCloseTo(0, 2);
    expect(g).toBeCloseTo(0, 2);
    expect(b).toBeCloseTo(0, 2);
  });

  it("converts white", () => {
    const [r, g, b] = oklchToSrgb("oklch(1 0 0)");
    expect(r).toBeCloseTo(1, 2);
    expect(g).toBeCloseTo(1, 2);
    expect(b).toBeCloseTo(1, 2);
  });

  it("throws on invalid input", () => {
    expect(() => oklchToSrgb("not a color")).toThrow();
  });
});

const baseColors: ThemeColors = {
  background: "#ffffff",
  foreground: "#000000",
  muted: "#f5f5f5",
  "muted-foreground": "#666666",
  accent: "#000000",
  "accent-foreground": "#ffffff",
  destructive: "#aa0000",
  border: "#cccccc",
  input: "#ffffff",
  ring: "#000000",
  primary: "#003366",
  secondary: "#660033",
  tertiary: "#003322",
  quaternary: "#553300",
  quinary: "#330055",
};

describe("checkPair", () => {
  it("passes for high-contrast pair", () => {
    const result = checkPair(baseColors, {
      fg: "foreground",
      bg: "background",
      level: "normal",
      slug: "bodyText",
    });
    expect(result?.passes).toBe(true);
    expect(result?.ratio).toBeGreaterThan(4.5);
  });

  it("fails for low-contrast pair", () => {
    const failingColors = { ...baseColors, foreground: "#eeeeee" };
    const result = checkPair(failingColors, {
      fg: "foreground",
      bg: "background",
      level: "normal",
      slug: "bodyText",
    });
    expect(result?.passes).toBe(false);
  });

  it("returns null for unsupported color format", () => {
    const broken = { ...baseColors, foreground: "??garbage??" };
    const result = checkPair(broken, {
      fg: "foreground",
      bg: "background",
      level: "normal",
      slug: "bodyText",
    });
    expect(result).toBeNull();
  });

  it("supports rgb() and hsl() formats", () => {
    const colors = {
      ...baseColors,
      foreground: "rgb(0, 0, 0)",
      background: "hsl(0, 0%, 100%)",
    };
    const result = checkPair(colors, {
      fg: "foreground",
      bg: "background",
      level: "normal",
      slug: "bodyText",
    });
    expect(result?.passes).toBe(true);
  });
});

describe("validatePalette + palettePassesAll", () => {
  const palette: ThemePalette = {
    name: "test",
    label: "Test",
    isDark: false,
    colors: baseColors,
  };

  it("returns one result per supported pair", () => {
    const results = validatePalette(palette);
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result).toHaveProperty("ratio");
      expect(result).toHaveProperty("passes");
    }
  });

  it("palettePassesAll is true when all pairs pass", () => {
    expect(palettePassesAll(palette)).toBe(true);
  });

  it("palettePassesAll is false when one pair fails", () => {
    const failing: ThemePalette = {
      ...palette,
      colors: { ...baseColors, foreground: "#dddddd" },
    };
    expect(palettePassesAll(failing)).toBe(false);
  });
});
