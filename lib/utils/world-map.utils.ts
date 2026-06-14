/**
 * Geometry helpers for the decorative world-map background.
 *
 * The projected border paths in `world-geometry.constants.ts` use only absolute
 * `M`/`L`/`Z` commands with `x,y` integer pairs, so a bounding box is just the
 * min/max of every coordinate — no real SVG path parser required.
 */

export type BoundingBox = {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
};

/**
 * Smallest box enclosing every coordinate across the given SVG path `d`
 * strings, or `null` when none carry any coordinates.
 */
export function pathsBoundingBox(paths: readonly string[]): BoundingBox | null {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const path of paths) {
    const numbers = path.match(/-?\d+(?:\.\d+)?/g);
    if (!numbers) continue;
    // Commands are all x,y pairs (M/L) or coordinate-less (Z), so the flat
    // number list is [x0, y0, x1, y1, ...].
    for (let i = 0; i + 1 < numbers.length; i += 2) {
      const x = Number(numbers[i]);
      const y = Number(numbers[i + 1]);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY };
}

function area(box: BoundingBox): number {
  return (box.maxX - box.minX) * (box.maxY - box.minY);
}

function enclose(a: BoundingBox, b: BoundingBox): BoundingBox {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

/**
 * Box framing each country's primary (largest) landmass, ignoring far-flung
 * overseas territories and tiny islands.
 *
 * Each entry in `countryPaths` is one country's full path `d` (polygons joined
 * by `Z`). Outliers like France's Caribbean territory would otherwise stretch a
 * raw {@link pathsBoundingBox} far off the mainland; keeping only the biggest
 * polygon per country yields a region centred on where the cluster actually is.
 * Returns `null` when no path carries coordinates.
 */
export function primaryRegionBoundingBox(
  countryPaths: readonly string[],
): BoundingBox | null {
  let region: BoundingBox | null = null;

  for (const d of countryPaths) {
    let primary: BoundingBox | null = null;
    for (const polygon of d.split("Z")) {
      const box = pathsBoundingBox([polygon]);
      if (box && (primary === null || area(box) > area(primary))) {
        primary = box;
      }
    }
    if (primary) region = region === null ? primary : enclose(region, primary);
  }

  return region;
}

/**
 * Build an SVG `viewBox` of a target `aspect` (width ÷ height) that fully
 * contains `box`, centred, after padding it on every side by `padding` × the
 * box's larger dimension.
 *
 * The visited cluster is landscape (wide) but phones are portrait; pairing a
 * portrait `aspect` here with `preserveAspectRatio="…slice"` lets the map cover
 * the full viewport height while the visible width still spans the whole
 * cluster. Larger `padding` zooms out (more ocean/context around the region).
 *
 * `verticalBias` (0 = centred, 0.5 = top-anchored) lifts the region toward the
 * top of the frame when the height is grown — useful when the area sits above a
 * lot of empty ocean that would otherwise pad out the top of the viewport.
 */
export function coverViewBox(
  box: BoundingBox,
  aspect: number,
  padding: number,
  verticalBias = 0,
): string {
  const margin = Math.max(box.maxX - box.minX, box.maxY - box.minY) * padding;
  let minX = box.minX - margin;
  let minY = box.minY - margin;
  let width = box.maxX - box.minX + margin * 2;
  let height = box.maxY - box.minY + margin * 2;

  if (width / height > aspect) {
    const grown = width / aspect;
    minY -= (grown - height) * (0.5 - verticalBias);
    height = grown;
  } else {
    const grown = height * aspect;
    minX -= (grown - width) / 2;
    width = grown;
  }

  return [minX, minY, width, height].join(" ");
}
