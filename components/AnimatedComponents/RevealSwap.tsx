"use client";

import { AnimatePresence, m } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/animation/motion";

interface RevealSwapProps {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}

/**
 * Opacity crossfade between a loading skeleton and resolved content. Stays on
 * the `domAnimation` feature set (no layout animation). The skeleton fades out,
 * then the content fades in (its own inner reveal then plays).
 */
export function RevealSwap({ loading, skeleton, children }: RevealSwapProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {loading ? (
        <m.div
          key="skeleton"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: EASE_OUT }}
        >
          {skeleton}
        </m.div>
      ) : (
        <m.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.16, ease: EASE_OUT }}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}
