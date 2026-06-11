"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { fadeTransition } from "@/lib/animation/motion";
import { cn } from "@/lib/utils";
import { BASE } from "./base";

interface RevealFadeProps {
  children: ReactNode;
  /** Delay before the fade starts, in milliseconds. */
  delay?: number;
  className?: string;
  /** Opt into an exit fade (only meaningful inside an AnimatePresence). */
  exit?: boolean;
}

/** Single-block fade — the default reveal for content that shouldn't stagger. */
export const RevealFade = ({
  children,
  delay = 0,
  className,
  exit,
}: RevealFadeProps) => (
  <m.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={exit ? { opacity: 0 } : undefined}
    transition={{ ...fadeTransition, delay: delay / 1000 }}
    className={cn(BASE, className)}
  >
    {children}
  </m.div>
);

/**
 * Back-compat alias. Existing renderers import `AnimatedSpan`; it now maps to
 * the block fade, so unconverted commands keep working unchanged.
 */
export const AnimatedSpan = RevealFade;
