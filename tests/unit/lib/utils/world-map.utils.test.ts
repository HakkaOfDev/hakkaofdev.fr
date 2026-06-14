import { describe, expect, it } from "vitest";
import {
  coverViewBox,
  pathsBoundingBox,
  primaryRegionBoundingBox,
} from "@/lib/utils/world-map.utils";

describe("pathsBoundingBox", () => {
  it("returns null when there are no paths", () => {
    expect(pathsBoundingBox([])).toBeNull();
  });

  it("returns null when a path carries no coordinates", () => {
    expect(pathsBoundingBox(["Z"])).toBeNull();
  });

  it("reads the min/max of a single path's coordinate pairs", () => {
    expect(pathsBoundingBox(["M0,0L10,20Z"])).toEqual({
      minX: 0,
      minY: 0,
      maxX: 10,
      maxY: 20,
    });
  });

  it("spans the extremes across multiple paths", () => {
    expect(pathsBoundingBox(["M5,5L5,5Z", "M0,30L40,1Z"])).toEqual({
      minX: 0,
      minY: 1,
      maxX: 40,
      maxY: 30,
    });
  });
});

describe("primaryRegionBoundingBox", () => {
  it("returns null when there are no paths", () => {
    expect(primaryRegionBoundingBox([])).toBeNull();
  });

  it("ignores a country's far-flung outlying polygons", () => {
    // One country: a large 10x10 landmass at the origin plus a tiny 1x1 island
    // far away. Only the primary landmass should frame the region.
    const country = "M0,0L10,0L10,10L0,10ZM100,100L101,100L101,101L100,101Z";
    expect(primaryRegionBoundingBox([country])).toEqual({
      minX: 0,
      minY: 0,
      maxX: 10,
      maxY: 10,
    });
  });

  it("encloses the primary landmass of every country", () => {
    const a = "M0,0L10,0L10,10L0,10Z";
    const b = "M20,20L30,20L30,30L20,30Z";
    expect(primaryRegionBoundingBox([a, b])).toEqual({
      minX: 0,
      minY: 0,
      maxX: 30,
      maxY: 30,
    });
  });
});

describe("coverViewBox", () => {
  it("leaves a box already at the target aspect untouched", () => {
    expect(coverViewBox({ minX: 0, minY: 0, maxX: 10, maxY: 20 }, 0.5, 0)).toBe(
      "0 0 10 20",
    );
  });

  it("expands a too-wide box's height, centred, to reach the aspect", () => {
    // aspect 2 box, target 0.5 -> height grows 10 -> 40, centred on y=5.
    expect(coverViewBox({ minX: 0, minY: 0, maxX: 20, maxY: 10 }, 0.5, 0)).toBe(
      "0 -15 20 40",
    );
  });

  it("expands a too-tall box's width, centred, to reach the aspect", () => {
    expect(coverViewBox({ minX: 0, minY: 0, maxX: 10, maxY: 40 }, 0.5, 0)).toBe(
      "-5 0 20 40",
    );
  });

  it("applies uniform padding before correcting the aspect", () => {
    // pad 0.1 * larger-dim(20) = 2 per side -> 14x24, then grow height to 28.
    expect(
      coverViewBox({ minX: 0, minY: 0, maxX: 10, maxY: 20 }, 0.5, 0.1),
    ).toBe("-2 -4 14 28");
  });

  it("biases the box toward the top when verticalBias > 0", () => {
    // aspect 2 box grows height 10 -> 40 (30 extra). Centred adds 15 above;
    // bias 0.25 adds only 30*(0.5-0.25)=7.5 above, lifting the box upward.
    expect(
      coverViewBox({ minX: 0, minY: 0, maxX: 20, maxY: 10 }, 0.5, 0, 0.25),
    ).toBe("0 -7.5 20 40");
  });
});
