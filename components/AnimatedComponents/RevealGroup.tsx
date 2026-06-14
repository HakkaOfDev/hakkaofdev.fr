"use client";

import { m, useReducedMotion } from "motion/react";
import {
  Children,
  createContext,
  isValidElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  revealDurationMs,
  revealGroupVariants,
  revealItemVariants,
} from "@/lib/animation/motion";
import { cn } from "@/lib/utils";
import { BASE } from "./base";

/**
 * True once the group's first reveal has finished. Children added afterwards
 * (refetch, polling, range change) read this and mount instantly, so live
 * updates never re-animate.
 */
const RevealedContext = createContext(false);

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  /** Skip the reveal entirely and render children statically. */
  instant?: boolean;
}

/**
 * Staggers its direct children into view on first mount. Each direct child is
 * auto-wrapped in a `RevealItem`, so converting a renderer is usually just
 * swapping `AnimatedSpan` → `RevealGroup` — the children stay untouched.
 */
export function RevealGroup({
  children,
  className,
  instant,
}: RevealGroupProps) {
  const prefersReduced = useReducedMotion();
  const skip = Boolean(instant) || Boolean(prefersReduced);

  const items = Children.toArray(children);
  const count = items.length;

  const [revealed, setRevealed] = useState(skip);

  useEffect(() => {
    if (skip) {
      setRevealed(true);
      return;
    }
    const timeout = setTimeout(
      () => setRevealed(true),
      revealDurationMs(count),
    );
    return () => clearTimeout(timeout);
  }, [skip, count]);

  if (skip) {
    return <div className={cn(BASE, className)}>{children}</div>;
  }

  return (
    <RevealedContext.Provider value={revealed}>
      <m.div
        className={cn(BASE, className)}
        variants={revealGroupVariants(count)}
        initial={revealed ? false : "hidden"}
        animate="visible"
      >
        {items.map((child, index) => {
          const key =
            (isValidElement(child) ? child.key : null) ?? `reveal-${index}`;
          return <RevealItem key={key}>{child}</RevealItem>;
        })}
      </m.div>
    </RevealedContext.Provider>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * A single staggered item. Inherits the parent group's orchestration during
 * the first reveal; mounts instantly (`initial={false}`) once the group has
 * already revealed.
 */
export function RevealItem({ children, className }: RevealItemProps) {
  const revealed = useContext(RevealedContext);
  return (
    <m.div
      className={className}
      variants={revealItemVariants}
      initial={revealed ? false : undefined}
    >
      {children}
    </m.div>
  );
}
