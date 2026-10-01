"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import {
  type TypedProgress,
  type TypedStepState,
  TypeStep,
  typedStep,
  useTypedGroups,
} from "@/components/AnimatedComponents";
import { Tag } from "@/components/ui/Tag";
import { revealItemVariants } from "@/lib/animation/motion";
import { cn } from "@/lib/utils";

export type TypedStep = (index: number) => TypedStepState;

const CARD_OWN_STEPS = 1;

const CARD_CLASS =
  "flex w-full min-w-0 flex-col gap-2 rounded-lg border border-border/60 p-2.5 text-start @md:p-3 dark:border-overlay-medium";

/**
 * Types a list of timeline cards in sequence: each card's date line first,
 * then its `bodyStepCounts[i]` body steps.
 */
export function useTimelineCardsTyping(
  bodyStepCounts: number[],
): TypedProgress[] {
  return useTypedGroups(bodyStepCounts.map((steps) => steps + CARD_OWN_STEPS));
}

/**
 * One entry of a typed timeline: the rail dot (pinging while `ongoing`), the
 * date range with its duration badge, then a card whose body `children` types
 * in through the `step` it receives. Pass `onSelect` to make the card a button.
 * Container queries keep it readable from phones to an expanded terminal.
 */
export function TimelineCard({
  range,
  duration,
  ongoing = false,
  isLast,
  typing,
  label,
  onSelect,
  children,
}: {
  range: string;
  duration?: string | null;
  ongoing?: boolean;
  isLast: boolean;
  typing: TypedProgress;
  label?: string;
  onSelect?: () => void;
  children: (step: TypedStep) => ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  if (typing.typed === 0) return null;

  const step: TypedStep = (index) => typedStep(typing, index);
  const bodyStep: TypedStep = (index) => step(index + CARD_OWN_STEPS);

  return (
    <m.div
      className={cn("relative border-s-2 ps-4 pb-4", isLast && "pb-1")}
      variants={revealItemVariants}
      initial={prefersReduced ? false : "hidden"}
      animate="visible"
    >
      <div className="absolute inset-s-[-5px] top-1.5 z-1 size-2 rounded-full bg-primary" />
      {ongoing ? (
        <div className="absolute inset-s-[-5px] top-1.5 size-2 animate-ping rounded-full bg-primary opacity-75" />
      ) : null}
      <div className="@container">
        <div className="grid @3xl:grid-cols-[14rem_minmax(0,1fr)] @3xl:gap-4 gap-2">
          <TypeStep
            className="flex @3xl:flex-col flex-wrap @3xl:items-start items-center gap-x-2 gap-y-1"
            {...step(0)}
          >
            <span className="font-semibold text-foreground">{range}</span>
            {duration ? <Tag label={duration} /> : null}
          </TypeStep>
          {onSelect ? (
            <button
              type="button"
              onClick={onSelect}
              aria-label={label}
              className={cn(
                CARD_CLASS,
                "cursor-pointer transition-colors hover:border-primary/50",
              )}
            >
              {children(bodyStep)}
            </button>
          ) : (
            <div className={CARD_CLASS}>{children(bodyStep)}</div>
          )}
        </div>
      </div>
    </m.div>
  );
}
