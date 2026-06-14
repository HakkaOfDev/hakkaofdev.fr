import { describe, expect, it } from "vitest";
import {
  computeStagger,
  DURATION,
  revealDurationMs,
  revealGroupVariants,
  revealItemVariants,
  STAGGER,
} from "@/lib/animation/motion";

describe("computeStagger", () => {
  it("returns 0 for empty or single-item groups", () => {
    expect(computeStagger(0)).toBe(0);
    expect(computeStagger(1)).toBe(0);
  });

  it("uses the ideal step for small groups", () => {
    // 0.5 / (2-1) = 0.5 > step → capped to step.
    expect(computeStagger(2)).toBe(STAGGER.step);
    expect(computeStagger(5)).toBe(STAGGER.step);
  });

  it("compresses the step so large groups finish within the window", () => {
    const count = 100;
    const stagger = computeStagger(count);
    expect(stagger).toBeLessThan(STAGGER.step);
    // The last item must start within the capped window.
    expect(stagger * (count - 1)).toBeLessThanOrEqual(STAGGER.window + 1e-9);
  });

  it("never lets the last item start later than the window, for any count", () => {
    for (const count of [2, 11, 12, 13, 50, 250, 1000]) {
      const lastStart = computeStagger(count) * (count - 1);
      expect(lastStart).toBeLessThanOrEqual(STAGGER.window + 1e-9);
    }
  });
});

describe("revealDurationMs", () => {
  it("is just the item duration for a single item", () => {
    expect(revealDurationMs(1)).toBe(Math.round(DURATION.base * 1000));
  });

  it("is bounded by the stagger window plus one item duration", () => {
    const upperBoundMs = Math.round((STAGGER.window + DURATION.base) * 1000);
    for (const count of [1, 10, 100, 1000]) {
      expect(revealDurationMs(count)).toBeLessThanOrEqual(upperBoundMs);
      expect(revealDurationMs(count)).toBeGreaterThan(0);
    }
  });

  it("grows with count until the window cap is reached", () => {
    expect(revealDurationMs(3)).toBeGreaterThan(revealDurationMs(1));
  });
});

describe("reveal variants", () => {
  it("defines hidden and visible item states", () => {
    expect(revealItemVariants.hidden).toMatchObject({ opacity: 0 });
    expect(revealItemVariants.visible).toMatchObject({ opacity: 1, y: 0 });
  });

  it("wires staggerChildren to the computed stagger", () => {
    const count = 4;
    const variants = revealGroupVariants(count);
    const visible = variants.visible as {
      transition: { staggerChildren: number };
    };
    expect(visible.transition.staggerChildren).toBe(computeStagger(count));
  });
});
