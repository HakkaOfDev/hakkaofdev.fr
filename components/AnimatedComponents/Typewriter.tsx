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

/**
 * A single typed line: fades in, optionally trailed by the caret. Shared by
 * `TypeLines` and `TimelineTypewriter`.
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
      transition={{ duration: 0.12, ease: EASE_OUT }}
    >
      {children}
      {caret ? <TypeCaret /> : null}
    </Line>
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
