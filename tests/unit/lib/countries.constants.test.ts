import { describe, expect, it } from "vitest";
import {
  COUNTRIES,
  COUNTRY_CODES,
  isVisited,
  SUBUNIT_CODES,
  SUBUNITS,
  VISITED_CODES,
} from "@/lib/constants/countries.constants";
import {
  WORLD_MAP_SHAPES,
  WORLD_MAP_SUBUNITS,
  WORLD_MAP_VIEWBOX,
} from "@/lib/constants/world-geometry.constants";

const codeSet = new Set<string>(COUNTRY_CODES);
const subunitCodeSet = new Set<string>(SUBUNIT_CODES);

describe("country codes", () => {
  it("are all valid ISO 3166-1 alpha-2 (two uppercase letters)", () => {
    for (const code of COUNTRY_CODES) {
      expect(code, code).toMatch(/^[A-Z]{2}$/);
    }
  });

  it("contain no duplicates", () => {
    expect(new Set(COUNTRY_CODES).size).toBe(COUNTRY_CODES.length);
  });

  it("are kept in sorted order", () => {
    expect([...COUNTRY_CODES]).toEqual([...COUNTRY_CODES].sort());
  });
});

describe("country metadata", () => {
  it("has one entry per code with matching alpha-2 keys", () => {
    expect(COUNTRIES.length).toBe(COUNTRY_CODES.length);
    expect(new Set(COUNTRIES.map((c) => c.code))).toEqual(codeSet);
  });

  it("has a non-empty name and alpha-3 for every country", () => {
    for (const country of COUNTRIES) {
      expect(country.name.length, country.code).toBeGreaterThan(0);
      expect(country.code3, country.code).toMatch(/^[A-Z]{3}$/);
    }
  });
});

describe("visited places", () => {
  it("reference only known country or subunit codes", () => {
    for (const code of VISITED_CODES) {
      expect(codeSet.has(code) || subunitCodeSet.has(code), code).toBe(true);
    }
  });

  it("contain no duplicates", () => {
    expect(new Set(VISITED_CODES).size).toBe(VISITED_CODES.length);
  });

  it("are recognised by isVisited", () => {
    expect(isVisited(VISITED_CODES[0])).toBe(true);
    expect(isVisited("ZZ")).toBe(false);
  });
});

describe("subunits", () => {
  it("map to known parent countries with a name", () => {
    for (const s of SUBUNITS) {
      expect(codeSet.has(s.code), s.su).toBe(true);
      expect(s.name.length, s.su).toBeGreaterThan(0);
    }
  });

  it("each have geometry in WORLD_MAP_SUBUNITS", () => {
    const drawn = new Set(WORLD_MAP_SUBUNITS.map((s) => s.su));
    for (const code of SUBUNIT_CODES) expect(drawn.has(code), code).toBe(true);
  });

  it("only emit geometry for declared subunit codes", () => {
    for (const s of WORLD_MAP_SUBUNITS) {
      expect(subunitCodeSet.has(s.su), s.su).toBe(true);
      expect(codeSet.has(s.code), s.code).toBe(true);
    }
  });
});

describe("world map geometry", () => {
  it("uses a width-1000 equirectangular viewBox with cropped poles", () => {
    expect(WORLD_MAP_VIEWBOX).toMatch(/^0 \d+ 1000 \d+$/);
    const [, , width, height] = WORLD_MAP_VIEWBOX.split(" ").map(Number);
    expect(width).toBe(1000);
    expect(height).toBeLessThan(500); // poles trimmed off the full projection
  });

  it("renders a substantial number of border shapes", () => {
    expect(WORLD_MAP_SHAPES.length).toBeGreaterThan(150);
  });

  it("excludes Antarctica (cropped out of the planisphere)", () => {
    expect(WORLD_MAP_SHAPES.some((s) => s.code === "AQ")).toBe(false);
  });

  it("only maps shapes to real country codes (or null)", () => {
    for (const shape of WORLD_MAP_SHAPES) {
      if (shape.code !== null) expect(codeSet.has(shape.code)).toBe(true);
    }
  });

  it("emits valid path data starting with a move command", () => {
    for (const shape of WORLD_MAP_SHAPES) {
      expect(shape.d.startsWith("M"), shape.code ?? "null").toBe(true);
    }
  });

  it("draws the overwhelming majority of visited places", () => {
    const drawnCountries = new Set<string>(
      WORLD_MAP_SHAPES.map((s) => s.code).filter(
        (code): code is NonNullable<typeof code> => code !== null,
      ),
    );
    const drawnSubunits = new Set<string>(WORLD_MAP_SUBUNITS.map((s) => s.su));
    // Natural Earth 110m omits a handful of microstates (e.g. Singapore), so
    // we assert near-total coverage rather than 100% — this still catches a
    // broken projection that would silently drop many borders.
    const drawn = VISITED_CODES.filter(
      (code) => drawnCountries.has(code) || drawnSubunits.has(code),
    );
    expect(drawn.length / VISITED_CODES.length).toBeGreaterThan(0.85);
  });
});
