import { isVisited } from "@/lib/constants/countries.constants";
import {
  WORLD_MAP_SHAPES,
  WORLD_MAP_SUBUNITS,
  WORLD_MAP_VIEWBOX,
} from "@/lib/constants/world-geometry.constants";
import { cn } from "@/lib/utils";
import {
  coverViewBox,
  primaryRegionBoundingBox,
} from "@/lib/utils/world-map.utils";

/**
 * The geometry that actually glows: visited whole countries plus visited
 * subunits (e.g. England, metropolitan France). Drives the mobile crop so it
 * frames exactly the visited region, not the whole parent country.
 */
const VISITED_PATHS = [
  ...WORLD_MAP_SHAPES.filter((s) => s.code !== null && isVisited(s.code)).map(
    (s) => s.d,
  ),
  ...WORLD_MAP_SUBUNITS.filter((s) => isVisited(s.su)).map((s) => s.d),
];

/**
 * Portrait `viewBox` cropped to the visited region, used below `md` where the
 * full ~2.5:1 planisphere collapses into an illegible strip. Derived once at
 * module load, framed on each region's primary landmass (so overseas territories
 * don't stretch it) with a portrait aspect, generous padding and an upward bias
 * so the cluster covers the height and rides toward the top of the frame.
 * Falls back to the whole world if nothing is visited.
 */
const VISITED_VIEWBOX = (() => {
  const box = primaryRegionBoundingBox(VISITED_PATHS);
  return box ? coverViewBox(box, 0.62, 0.9, 0.4) : WORLD_MAP_VIEWBOX;
})();

/**
 * Ambient, decorative world-map planisphere rendered behind the whole site.
 *
 * Pure server component. A faint base layer outlines every country; on top, the
 * visited places glow with the active theme's `primary` accent and gently pulse
 * (the only motion — see globals.css — disabled under `prefers-reduced-motion`).
 *
 * The glow is layered, not baked into the base, so it can target constituents:
 * a visited whole country lights its base shape, while a visited subunit (e.g.
 * England, metropolitan France) overlays just that region — leaving Scotland or
 * French Guiana as plain outlines. Two SVGs share these paths and CSS toggles
 * between them: phones get the {@link VISITED_VIEWBOX} crop, `≥md` viewports get
 * the full planisphere. Non-interactive, hidden from a11y tools.
 */
export function WorldMapBackground({ className }: { className?: string }) {
  const paths = [
    // Base layer: every country outline; visited whole countries glow.
    ...WORLD_MAP_SHAPES.map((shape, index) => (
      <path
        // Codes are unique; unmapped borders fall back to their index.
        key={shape.code ?? `border-${index}`}
        d={shape.d}
        className={cn(
          "world-map-country",
          shape.code !== null &&
            isVisited(shape.code) &&
            "world-map-country--visited",
        )}
      />
    )),
    // Overlay: only the visited subunits, glowing on top of the base.
    ...WORLD_MAP_SUBUNITS.filter((s) => isVisited(s.su)).map((s) => (
      <path
        key={`su-${s.su}`}
        d={s.d}
        className="world-map-country world-map-country--visited"
      />
    )),
  ];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16",
        className,
      )}
    >
      {/* Below md: cropped to the visited region, covering the full viewport
          so it reads as an ambient backdrop instead of a centred band. */}
      <svg
        className="absolute inset-0 h-full w-full md:hidden"
        viewBox={VISITED_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
        focusable="false"
      >
        <title>World map of visited countries</title>
        {paths}
      </svg>
      {/* ≥md: the full planisphere. */}
      <svg
        className="hidden h-auto w-full max-w-[1600px] md:block"
        viewBox={WORLD_MAP_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
        focusable="false"
      >
        <title>World map of visited countries</title>
        {paths}
      </svg>
    </div>
  );
}
