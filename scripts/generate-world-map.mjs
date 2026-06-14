/**
 * Generates the world-map background data from authoritative open datasets:
 *   - `world-countries` → ISO 3166-1 metadata (alpha-2/alpha-3, name, region)
 *   - `world-atlas` (Natural Earth 110m) → country border geometry
 *   - `scripts/data/subunits-50m.geojson` → Natural Earth 50m map subunits for a
 *     few "splittable" countries (UK → England/Scotland/Wales/N.Ireland, France
 *     → metropolitan / Corsica / overseas), so the visited glow can target a
 *     constituent region instead of the whole sovereign state.
 *
 * Emits two committed source files (runtime stays dependency-free):
 *   - lib/constants/countries.constants.ts   (typed metadata + editable VISITED)
 *   - lib/constants/world-geometry.constants.ts (equirectangular SVG paths)
 *
 * The `VISITED_CODES` block is hand-editable and preserved across runs.
 *
 * Regenerate:  bun run scripts/generate-world-map.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const countries = require("world-countries");
const topojson = require("topojson-client");
const topology = require("world-atlas/countries-110m.json");
const { geoEquirectangular, geoPath } = require("d3-geo");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const COUNTRIES_OUT = resolve(ROOT, "lib/constants/countries.constants.ts");
const GEOMETRY_OUT = resolve(ROOT, "lib/constants/world-geometry.constants.ts");
const SUBUNITS_IN = resolve(ROOT, "scripts/data/subunits-50m.geojson");

// Equirectangular projection canvas (2:1 plate carrée planisphere).
const WIDTH = 1000;
const HEIGHT = 500;

// Crop the poles so the map reads as a clean band: drops Antarctica and the
// empty Arctic. This latitude window becomes the emitted SVG viewBox.
const LAT_MAX = 85;
const LAT_MIN = -58;

// Centre the projection on ~11°E so the antimeridian cut falls in the Bering
// Strait: the map starts at Alaska on the left and Russia stays whole on the
// right (no stray Chukotka sliver, no cut-off eastern tip).
const CENTER_LON = 11;

/** ISO 3166-1 `region` → our Continent union. */
const CONTINENT_BY_REGION = {
  Africa: "Africa",
  Americas: "Americas",
  Asia: "Asia",
  Europe: "Europe",
  Oceania: "Oceania",
  Antarctic: "Antarctica",
};

// Legacy whole-country visited codes → their primary subunit, applied once when
// migrating an old `VISITED_COUNTRY_CODES` block to the subunit-aware model.
const SUBUNIT_MIGRATION = { FR: "FXX", GB: "ENG" };

/** Default seed used only when no existing VISITED block is found. */
const DEFAULT_VISITED = ["ES", "IT", "BE", "NL", "HU", "LU", "FXX", "ENG"];

// Equirectangular projection onto the WIDTH×HEIGHT canvas. d3-geo clips at the
// antimeridian (so Russia and the Aleutians don't smear a line across the map)
// and `digits(0)` keeps coordinates at integer precision.
const projection = geoEquirectangular()
  .rotate([-CENTER_LON, 0])
  .scale(WIDTH / (2 * Math.PI))
  .translate([WIDTH / 2, HEIGHT / 2]);
const toPath = geoPath(projection).digits(0);

function geometryToPath(geometry) {
  return toPath(geometry) ?? "";
}

/** Preserve a hand-edited VISITED list across regenerations. */
function readExistingVisited() {
  if (!existsSync(COUNTRIES_OUT)) return null;
  const source = readFileSync(COUNTRIES_OUT, "utf8");
  // Current model: VISITED_CODES holds alpha-2 country codes and/or 3-letter
  // subunit codes.
  const current = source.match(/VISITED_CODES = \[([\s\S]*?)\] as const/);
  if (current) {
    const codes = [...current[1].matchAll(/"([A-Z]{2,3})"/g)].map((m) => m[1]);
    if (codes.length > 0) return codes;
  }
  // Legacy model: VISITED_COUNTRY_CODES held only alpha-2 codes; map any split
  // country to its primary subunit so the glow doesn't regress to whole-state.
  const legacy = source.match(
    /VISITED_COUNTRY_CODES = \[([\s\S]*?)\] as const/,
  );
  if (legacy) {
    const codes = [...legacy[1].matchAll(/"([A-Z]{2})"/g)].map((m) => m[1]);
    if (codes.length > 0) return codes.map((c) => SUBUNIT_MIGRATION[c] ?? c);
  }
  return null;
}

// ── Build country metadata ────────────────────────────────────────────────
const meta = countries
  .map((c) => ({
    code: c.cca2,
    code3: c.cca3,
    name: c.name.common,
    continent: CONTINENT_BY_REGION[c.region] ?? "Other",
  }))
  .filter((c) => /^[A-Z]{2}$/.test(c.code));

const byCode = new Map(meta.map((c) => [c.code, c]));
const countryName = new Map(meta.map((c) => [c.code, c.name]));
const sortedByName = [...meta].sort((a, b) => a.name.localeCompare(b.name));
const sortedCodes = [...meta.map((c) => c.code)].sort();

// ── Build country geometry, keyed back to alpha-2 via numeric ISO ─────────
const numericToCode = new Map();
const alpha3ToCode = new Map();
for (const c of countries) {
  const numeric = Number.parseInt(c.ccn3, 10);
  if (!Number.isNaN(numeric)) numericToCode.set(numeric, c.cca2);
  alpha3ToCode.set(c.cca3, c.cca2);
}

const featureCollection = topojson.feature(
  topology,
  topology.objects.countries,
);
const shapes = [];
for (const feature of featureCollection.features) {
  const code = numericToCode.get(Number(feature.id)) ?? null;
  if (code === "AQ") continue; // Antarctica — cropped out of the planisphere.
  const d = geometryToPath(feature.geometry);
  if (d) shapes.push({ code: byCode.has(code) ? code : null, d });
}
const mappedCount = shapes.filter((s) => s.code !== null).length;

// ── Build subunit geometry for splittable countries ───────────────────────
const subunitsFC = JSON.parse(readFileSync(SUBUNITS_IN, "utf8"));
const subunits = [];
for (const feature of subunitsFC.features) {
  const code = alpha3ToCode.get(feature.properties.adm0_a3) ?? null;
  const su = feature.properties.su_a3;
  const d = geometryToPath(feature.geometry);
  if (code && su && d)
    subunits.push({ su, code, name: feature.properties.name, d });
}
subunits.sort((a, b) => a.su.localeCompare(b.su));
const subunitCodes = subunits.map((s) => s.su);
const subunitName = new Map(subunits.map((s) => [s.su, s.name]));

const labelFor = (code) =>
  subunitName.get(code) ?? countryName.get(code) ?? code;

// ── Emit countries.constants.ts ───────────────────────────────────────────
const visited = readExistingVisited() ?? DEFAULT_VISITED;
const visitedLines = visited.map((c) => `  "${c}", // ${labelFor(c)}`);

const codeLines = [];
for (let i = 0; i < sortedCodes.length; i += 12) {
  codeLines.push(
    `  ${sortedCodes
      .slice(i, i + 12)
      .map((c) => `"${c}"`)
      .join(", ")},`,
  );
}

const subunitCodeLines = [];
for (let i = 0; i < subunitCodes.length; i += 12) {
  subunitCodeLines.push(
    `  ${subunitCodes
      .slice(i, i + 12)
      .map((c) => `"${c}"`)
      .join(", ")},`,
  );
}

const countryLines = sortedByName.map(
  (c) =>
    `  { code: "${c.code}", code3: "${c.code3}", name: ${JSON.stringify(c.name)}, continent: "${c.continent}" },`,
);

const subunitLines = subunits.map(
  (s) =>
    `  { su: "${s.su}", code: "${s.code}", name: ${JSON.stringify(s.name)} },`,
);

const countriesSource = `// AUTO-GENERATED by scripts/generate-world-map.mjs — do not edit COUNTRIES,
// COUNTRY_CODES, SUBUNITS or the types by hand. Regenerate with:
//   bun run scripts/generate-world-map.mjs
// Source data: \`world-countries\` (ISO 3166-1) + \`world-atlas\` geometry +
// Natural Earth 50m map subunits (scripts/data/subunits-50m.geojson).

export type Continent =
  | "Africa"
  | "Americas"
  | "Asia"
  | "Europe"
  | "Oceania"
  | "Antarctica"
  | "Other";

/** Every ISO 3166-1 alpha-2 code, sorted. Drives the \`CountryCode\` union. */
export const COUNTRY_CODES = [
${codeLines.join("\n")}
] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

export type Country = {
  /** ISO 3166-1 alpha-2 (e.g. "FR"). */
  readonly code: CountryCode;
  /** ISO 3166-1 alpha-3 (e.g. "FRA"). */
  readonly code3: string;
  /** Common English name. */
  readonly name: string;
  readonly continent: Continent;
};

/** Every country, sorted by name. */
export const COUNTRIES: readonly Country[] = [
${countryLines.join("\n")}
];

/**
 * Natural Earth map-subunit codes (\`su_a3\`) for the countries we split into
 * constituents, so the visited glow can target e.g. England without Scotland or
 * metropolitan France without its overseas territories.
 */
export const SUBUNIT_CODES = [
${subunitCodeLines.join("\n")}
] as const;

export type SubunitCode = (typeof SUBUNIT_CODES)[number];

export type Subunit = {
  /** Natural Earth subunit code (e.g. "ENG"). */
  readonly su: SubunitCode;
  /** Parent country alpha-2 (e.g. "GB"). */
  readonly code: CountryCode;
  /** Common English name. */
  readonly name: string;
};

/** Every splittable subunit, sorted by code. */
export const SUBUNITS: readonly Subunit[] = [
${subunitLines.join("\n")}
];

// ── EDIT HERE: places visited as a digital nomad ──────────────────────────
// Hand-maintained and preserved when the file is regenerated. Use an alpha-2
// country code to light up a whole country, or a 3-letter subunit code (see
// SUBUNITS above) to light up just one constituent. Only valid codes type-check.
export const VISITED_CODES = [
${visitedLines.join("\n")}
] as const satisfies readonly (CountryCode | SubunitCode)[];
// ── END EDIT ──────────────────────────────────────────────────────────────

export const VISITED_SET: ReadonlySet<string> = new Set(VISITED_CODES);

/** Is this country or subunit code marked as visited? */
export function isVisited(code: string): boolean {
  return VISITED_SET.has(code);
}

const COUNTRY_BY_CODE: ReadonlyMap<CountryCode, Country> = new Map(
  COUNTRIES.map((country) => [country.code, country]),
);

/** Look up a country's metadata by alpha-2 code. */
export function getCountry(code: CountryCode): Country | undefined {
  return COUNTRY_BY_CODE.get(code);
}
`;

// ── Emit world-geometry.constants.ts ──────────────────────────────────────
// viewBox windows the full-width projection to the cropped latitude band.
const viewY = Math.round(((90 - LAT_MAX) / 180) * HEIGHT);
const viewH = Math.round(((90 - LAT_MIN) / 180) * HEIGHT) - viewY;

const shapeLines = shapes.map(
  (s) => `  { code: ${s.code ? `"${s.code}"` : "null"}, d: "${s.d}" },`,
);

const subunitShapeLines = subunits.map(
  (s) => `  { su: "${s.su}", code: "${s.code}", d: "${s.d}" },`,
);

const geometrySource = `// AUTO-GENERATED by scripts/generate-world-map.mjs — do not edit by hand.
// Equirectangular (plate carrée) projection of Natural Earth borders
// (110m countries + 50m map subunits). Regenerate with:
//   bun run scripts/generate-world-map.mjs

import type { CountryCode, SubunitCode } from "./countries.constants";

/** SVG viewBox for the projected planisphere (poles cropped). */
export const WORLD_MAP_VIEWBOX = "0 ${viewY} ${WIDTH} ${viewH}" as const;

export type WorldMapShape = {
  /** alpha-2 code when the border maps to an ISO country, else \`null\`. */
  readonly code: CountryCode | null;
  /** SVG path data in viewBox coordinates. */
  readonly d: string;
};

/** Every rendered country border, in draw order (the faint base layer). */
export const WORLD_MAP_SHAPES: readonly WorldMapShape[] = [
${shapeLines.join("\n")}
];

export type WorldMapSubunit = {
  /** Natural Earth subunit code (e.g. "ENG"). */
  readonly su: SubunitCode;
  /** Parent country alpha-2 (e.g. "GB"). */
  readonly code: CountryCode;
  /** SVG path data in viewBox coordinates (same space as WORLD_MAP_SHAPES). */
  readonly d: string;
};

/** Subunit geometry for splittable countries — the visited glow overlay. */
export const WORLD_MAP_SUBUNITS: readonly WorldMapSubunit[] = [
${subunitShapeLines.join("\n")}
];
`;

writeFileSync(COUNTRIES_OUT, countriesSource);
writeFileSync(GEOMETRY_OUT, geometrySource);

// Format the emitted files so they match the repo's Biome config (and stay
// clean under `format:check` after every regeneration). Best-effort.
try {
  const biome = resolve(ROOT, "node_modules/.bin/biome");
  execFileSync(biome, ["format", "--write", COUNTRIES_OUT, GEOMETRY_OUT], {
    stdio: "ignore",
  });
} catch {
  // Biome unavailable — emitted files are still valid, just unformatted.
}

console.log(
  `✓ countries.constants.ts — ${meta.length} countries, ${subunits.length} subunits, ${visited.length} visited`,
);
console.log(
  `✓ world-geometry.constants.ts — ${shapes.length} shapes (${mappedCount} ISO-mapped) + ${subunits.length} subunits`,
);
