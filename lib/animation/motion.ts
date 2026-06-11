import type { Transition, Variants } from "motion/react";
import { cubicBezier } from "motion/react";

/**
 * Shared motion tokens for the terminal reveal system.
 *
 * Single source of truth for easing, durations and stagger so every command
 * reveal feels coherent. Consumed by the primitives in
 * `components/AnimatedComponents.tsx`.
 */

/** Snappy ease-out used for reveals (fast start, gentle settle). */
export const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);
/** Standard curve mirrored from the Dialog transition. */
export const EASE_STANDARD = cubicBezier(0.25, 0.1, 0.25, 1);

/** Durations in seconds. */
export const DURATION = {
  fast: 0.16,
  base: 0.26,
  slow: 0.4,
} as const;

/** Stagger config in seconds. */
export const STAGGER = {
  /** Ideal delay between consecutive items. */
  step: 0.045,
  /** Hard cap on the total stagger window before the last item starts. */
  window: 0.5,
} as const;

/** Vertical slide offset (px) for a revealing item. */
export const REVEAL_Y = 6;

/** Milliseconds between lines in the typewriter reveal. */
export const TYPE_LINE_MS = 150;

/**
 * Upper bound (ms) on how long a whole multi-line typewriter takes. For dense
 * content (timelines with many lines) the per-line delay is compressed to keep
 * the total within this window, so a long history never feels endless.
 */
export const TYPE_WINDOW_MS = 2200;

/**
 * Per-line delay (ms): the base cadence, compressed so a many-line reveal still
 * finishes within `TYPE_WINDOW_MS`.
 */
export function computeTypeLineMs(
  total: number,
  base: number = TYPE_LINE_MS,
  window: number = TYPE_WINDOW_MS,
): number {
  if (total <= 1) return base;
  return Math.min(base, Math.round(window / total));
}

/**
 * Artificial "thinking" beat (ms) shown — as pulsing dots — before a command's
 * output appears. Gives the terminal its deliberate cadence; the per-command
 * reveal animation then paces the rest.
 */
export const THINKING_DELAY_MS = 500;

/**
 * Per-item stagger delay (seconds), capped so large lists don't get a long
 * tail: the last item always starts within `window` seconds.
 */
export function computeStagger(
  count: number,
  step: number = STAGGER.step,
  window: number = STAGGER.window,
): number {
  if (count <= 1) return 0;
  return Math.min(step, window / (count - 1));
}

/**
 * Total time (ms) for a staggered reveal of `count` items to fully finish.
 * Used to flip the "already revealed" latch so later updates skip animation.
 */
export function revealDurationMs(count: number): number {
  const stagger = computeStagger(count);
  const lastStart = stagger * Math.max(0, count - 1);
  return Math.round((lastStart + DURATION.base) * 1000);
}

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_Y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

export function revealGroupVariants(count: number): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: computeStagger(count) },
    },
  };
}

export const fadeTransition: Transition = {
  duration: DURATION.base,
  ease: EASE_OUT,
};
