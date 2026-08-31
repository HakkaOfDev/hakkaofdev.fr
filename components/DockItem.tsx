"use client";

import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { DURATION, EASE_OUT } from "@/lib/animation/motion";
import { useWindowStore } from "@/stores/window.store";

const TILE_SIZE = 32;
const SLOT_WIDTH = TILE_SIZE + 12 + 1 + 12;

export function DockItem() {
  const t = useTranslations("Terminal");
  const isMinimized = useWindowStore((state) => state.isMinimized);
  const restore = useWindowStore((state) => state.restore);
  const setDockAnchor = useWindowStore((state) => state.setDockAnchor);
  const slotRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const slot = slotRef.current;
    if (!slot || useWindowStore.getState().isMinimized) return;
    const rect = slot.getBoundingClientRect();

    setDockAnchor({
      x: rect.left - SLOT_WIDTH / 2 + TILE_SIZE / 2,
      y: rect.bottom - TILE_SIZE / 2,
    });
  }, [setDockAnchor]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      setDockAnchor(null);
    };
  }, [measure, setDockAnchor]);

  return (
    <m.div
      ref={slotRef}
      initial={false}
      animate={{ width: isMinimized ? SLOT_WIDTH : 0 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
      onAnimationComplete={measure}
      className="relative -mr-3 h-4.5 shrink-0"
    >
      <AnimatePresence>
        {isMinimized ? (
          <m.div
            initial={{ opacity: 0, scale: 0.4, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: 10 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            className="absolute bottom-0 left-0 flex items-end gap-3"
          >
            <button
              type="button"
              onClick={restore}
              aria-label={t("trafficLights.restoreMinimize")}
              className="group relative flex h-8 w-8 cursor-pointer items-center justify-center"
            >
              <Image
                src="/logo.png"
                alt=""
                width={TILE_SIZE}
                height={TILE_SIZE}
                sizes="64px"
                className="h-8 w-8 rounded-xl bg-background/70 shadow-sm ring-1 ring-border backdrop-blur-xs transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95 dark:ring-overlay-medium"
              />
              <span className="absolute -bottom-2 left-1/2 flex h-1 w-1 -translate-x-1/2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1 w-1 rounded-full bg-primary" />
              </span>
            </button>
            <span
              aria-hidden
              className="h-5 w-px rounded-full bg-border dark:bg-overlay-medium"
            />
          </m.div>
        ) : null}
      </AnimatePresence>
    </m.div>
  );
}
