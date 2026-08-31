"use client";

import { m } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { DURATION, EASE_OUT } from "@/lib/animation/motion";
import { cn } from "@/lib/utils";
import { useWindowStore } from "@/stores/window.store";

const MINIMIZED_SCALE = 0.05;

type Flight = { x: number; y: number };

interface WindowStageProps {
  children: React.ReactNode;
}

export function WindowStage({ children }: WindowStageProps) {
  const isMinimized = useWindowStore((state) => state.isMinimized);
  const stageRef = useRef<HTMLElement>(null);
  const wasMinimized = useRef(false);
  const [flight, setFlight] = useState<Flight>({ x: 0, y: 0 });
  const [isFlying, setIsFlying] = useState(false);

  useLayoutEffect(() => {
    if (isMinimized === wasMinimized.current) return;
    wasMinimized.current = isMinimized;
    setIsFlying(true);
    if (!isMinimized) return;

    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const dock = useWindowStore.getState().dockAnchor ?? {
      x: originX,
      y: window.innerHeight,
    };
    setFlight({ x: dock.x - originX, y: dock.y - originY });
  }, [isMinimized]);

  const handleAnimationComplete = useCallback(() => setIsFlying(false), []);

  return (
    <m.main
      ref={stageRef}
      initial={false}
      animate={isMinimized ? "minimized" : "open"}
      variants={{
        open: { opacity: 1, scale: 1, x: 0, y: 0 },
        minimized: {
          opacity: 0,
          scale: MINIMIZED_SCALE,
          x: flight.x,
          y: flight.y,
        },
      }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      onAnimationComplete={handleAnimationComplete}
      aria-hidden={isMinimized}
      inert={isMinimized}
      className={cn(
        "container mx-auto flex flex-1 flex-col items-center justify-center gap-8 px-4 py-6",
        isMinimized || isFlying ? "overflow-visible" : "overflow-hidden",
        isMinimized && !isFlying && "invisible",
      )}
    >
      {children}
    </m.main>
  );
}
