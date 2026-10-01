"use client";

import { m, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { DURATION, EASE_OUT } from "@/lib/animation/motion";

/**
 * Smoothly animates its height to fit its content whenever the content
 * resizes (tab switch, expanding text…), instead of jumping. Measures with a
 * ResizeObserver and tweens `height`, so it stays on the `domAnimation`
 * feature set (no layout animation).
 */
export function AutoHeight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const observer = new ResizeObserver(() => {
      setHeight(content.offsetHeight);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <m.div
      className="overflow-hidden"
      initial={false}
      animate={{ height }}
      transition={{
        duration: prefersReduced ? 0 : DURATION.slow,
        ease: EASE_OUT,
      }}
    >
      <div ref={contentRef} className={className}>
        {children}
      </div>
    </m.div>
  );
}
