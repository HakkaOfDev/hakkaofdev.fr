"use client";

import { m, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import {
  computeTypeLineMs,
  EASE_OUT,
  TYPE_LINE_MS,
} from "@/lib/animation/motion";
import { cn } from "@/lib/utils";
import { BASE } from "./base";

const TYPE_TRANSITION = { duration: 0.12, ease: EASE_OUT };

function TypeCaret() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.12em] bg-primary align-text-bottom motion-reduce:hidden"
      style={{ animation: "cursor-blink 1s step-end infinite" }}
    />
  );
}

/**
 * Reveals `total` items one at a time on an interval and returns how many are
 * currently revealed. Strict-Mode safe (re-subscribes on every effect run);
 * jumps straight to `total` when the user prefers reduced motion.
 */
export function useTypewriter(
  total: number,
  lineMs: number = TYPE_LINE_MS,
): number {
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(prefersReduced ? total : 0);

  useEffect(() => {
    if (prefersReduced) {
      setCount(total);
      return;
    }
    setCount(0);
    let revealed = 0;
    const id = setInterval(() => {
      revealed += 1;
      setCount(revealed);
      if (revealed >= total) clearInterval(id);
    }, lineMs);
    return () => clearInterval(id);
  }, [prefersReduced, total, lineMs]);

  return count;
}

export type TypedProgress = { typed: number; typing: boolean };

export type TypedStepState = { shown: boolean; caret: boolean };

/**
 * Types several groups in sequence, one step at a time across all of them
 * (e.g. cards whose lines and tags appear in order). Returns, per group, how
 * many of its `stepCounts[i]` steps are revealed and whether the caret is in it.
 */
export function useTypedGroups(stepCounts: number[]): TypedProgress[] {
  const total = stepCounts.reduce((sum, steps) => sum + steps, 0);
  const typedSteps = useTypewriter(total, computeTypeLineMs(total));

  let stepsBefore = 0;
  return stepCounts.map((steps) => {
    const typed = typedSteps - stepsBefore;
    stepsBefore += steps;
    return {
      typed: Math.max(0, Math.min(typed, steps)),
      typing: typedSteps < total && typed > 0 && typed <= steps,
    };
  });
}

/** Visibility and caret for step `index` of a group typed by `useTypedGroups`. */
export function typedStep(
  { typed, typing }: TypedProgress,
  index: number,
): TypedStepState {
  return { shown: index < typed, caret: typing && index === typed - 1 };
}

/**
 * A single typed line: fades in, optionally trailed by the caret. Used by
 * `TypeLines`.
 */
export function TypeLine({
  children,
  reduced,
  caret,
  as = "div",
}: {
  children: ReactNode;
  reduced: boolean | null;
  caret: boolean;
  as?: "div" | "li";
}) {
  const Line = as === "li" ? m.li : m.div;
  return (
    <Line
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TYPE_TRANSITION}
    >
      {children}
      {caret ? <TypeCaret /> : null}
    </Line>
  );
}

const TYPE_STEP_ELEMENTS = { div: m.div, p: m.p, span: m.span } as const;

/**
 * A typed step that keeps its layout slot: mounted from the start but
 * transparent until `shown`, so a surrounding frame (a card) never reflows
 * while its content types in. Drive `shown` and `caret` with `useTypewriter`.
 */
export function TypeStep({
  children,
  shown,
  caret,
  as = "div",
  className,
}: {
  children: ReactNode;
  shown: boolean;
  caret: boolean;
  as?: keyof typeof TYPE_STEP_ELEMENTS;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const Step = TYPE_STEP_ELEMENTS[as];
  return (
    <Step
      className={className}
      initial={prefersReduced ? false : { opacity: 0 }}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={TYPE_TRANSITION}
    >
      {children}
      {caret ? <TypeCaret /> : null}
    </Step>
  );
}

interface TypeLinesProps {
  lines: ReactNode[];
  className?: string;
  /** Base milliseconds between successive lines (compressed for long lists). */
  lineMs?: number;
}

/**
 * Reveals `lines` one after another, as if printed by a shell, with a blinking
 * caret trailing the most-recent line until done. Line-level (not char-level)
 * so rich JSX inside a line is preserved. Respects reduced motion (renders all
 * lines immediately) and only ever types once per mount.
 */
export function TypeLines({
  lines,
  className,
  lineMs = TYPE_LINE_MS,
}: TypeLinesProps) {
  const prefersReduced = useReducedMotion();
  const total = lines.length;
  const count = useTypewriter(total, computeTypeLineMs(total, lineMs));
  const done = count >= total;

  return (
    <div className={cn(BASE, className)}>
      {lines.slice(0, count).map((line, index) => (
        <TypeLine
          // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional and stable for a command instance.
          key={index}
          reduced={prefersReduced}
          caret={!done && index === count - 1}
        >
          {line}
        </TypeLine>
      ))}
    </div>
  );
}
