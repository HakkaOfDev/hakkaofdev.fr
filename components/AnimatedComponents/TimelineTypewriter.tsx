"use client";

import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { computeTypeLineMs, TYPE_LINE_MS } from "@/lib/animation/motion";
import { cn } from "@/lib/utils";
import { BASE } from "./base";
import { TypeLine, useTypewriter } from "./Typewriter";

export interface TimelineEntry {
  key: string;
  /** Extra absolutely-positioned marker inside the entry (e.g. a current ping). */
  marker?: ReactNode;
  /** Head lines (period, name, sub…), typed in order. */
  lines: ReactNode[];
  /** Optional bullet lines, typed after the head lines. */
  bullets?: ReactNode[];
}

/**
 * Types a timeline (experiences / education) out line-by-line across all
 * entries — period, role, company, then each bullet — instead of revealing
 * whole entries at once. Keeps the bordered timeline rail + dot per entry; the
 * caret follows the most-recent line. Cadence is compressed so a long history
 * still finishes within the type window.
 */
export function TimelineTypewriter({
  entries,
  lineMs = TYPE_LINE_MS,
}: {
  entries: TimelineEntry[];
  lineMs?: number;
}) {
  const prefersReduced = useReducedMotion();
  const lengths = entries.map(
    (entry) => entry.lines.length + (entry.bullets?.length ?? 0),
  );
  const total = lengths.reduce((sum, n) => sum + n, 0);
  const count = useTypewriter(total, computeTypeLineMs(total, lineMs));
  const done = count >= total;
  const caretIndex = count - 1;

  let cursor = 0;
  return (
    <div className={cn(BASE)}>
      {entries.map((entry, entryIndex) => {
        const start = cursor;
        cursor += lengths[entryIndex];
        const shown = Math.max(
          0,
          Math.min(count, start + lengths[entryIndex]) - start,
        );
        if (shown === 0) return null;

        const headShown = Math.min(shown, entry.lines.length);
        const bulletsShown = Math.max(0, shown - entry.lines.length);
        const isLast = entryIndex === entries.length - 1;

        return (
          <div
            key={entry.key}
            className={cn("relative border-s-2 ps-4 pb-4", isLast && "pb-1")}
          >
            <div className="absolute inset-s-[-5px] top-1 z-1 size-2 rounded-full bg-primary" />
            {entry.marker}
            {entry.lines.slice(0, headShown).map((line, lineIndex) => (
              <TypeLine
                // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional and stable.
                key={lineIndex}
                reduced={prefersReduced}
                caret={!done && start + lineIndex === caretIndex}
              >
                {line}
              </TypeLine>
            ))}
            {entry.bullets && bulletsShown > 0 ? (
              <ul className="mt-2 list-disc ps-4">
                {entry.bullets
                  .slice(0, bulletsShown)
                  .map((bullet, bulletIndex) => (
                    <TypeLine
                      as="li"
                      // biome-ignore lint/suspicious/noArrayIndexKey: bullets are positional and stable.
                      key={bulletIndex}
                      reduced={prefersReduced}
                      caret={
                        !done &&
                        start + entry.lines.length + bulletIndex === caretIndex
                      }
                    >
                      {bullet}
                    </TypeLine>
                  ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
