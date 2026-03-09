"use client";

import type { PointerEvent } from "react";
import { cn } from "@/lib/utils";
import type { ResizeDirection } from "@/types/terminal";

interface TerminalResizeHandlesProps {
  isLayoutInteractive: boolean;
  isDesktopViewport: boolean;
  isMinimized: boolean;
  resizeHandles: ReadonlyArray<{
    direction: ResizeDirection;
    className: string;
  }>;
  onResizeStart: (
    direction: ResizeDirection,
  ) => (event: PointerEvent<HTMLSpanElement>) => void;
}

function TerminalResizeHandles({
  isLayoutInteractive,
  isDesktopViewport,
  isMinimized,
  resizeHandles,
  onResizeStart,
}: TerminalResizeHandlesProps) {
  if (!isLayoutInteractive || !isDesktopViewport) return null;

  return resizeHandles.map((handle) => (
    <span
      key={handle.direction}
      aria-hidden
      onPointerDown={onResizeStart(handle.direction)}
      className={cn(
        "absolute z-20 touch-none rounded-sm",
        handle.className,
        isMinimized && "pointer-events-none",
      )}
    />
  ));
}

export { TerminalResizeHandles };
