import type { RefObject } from "react";
import { getTerminalMinimums, TERMINAL_LAYOUT } from "@/lib/terminal-layout";
import type { ResizeDirection } from "@/types/terminal";

export const RESIZE_HANDLES: ReadonlyArray<{
  direction: ResizeDirection;
  className: string;
}> = [
  { direction: "n", className: "top-0 right-3 left-3 h-2 cursor-ns-resize" },
  { direction: "s", className: "right-3 bottom-0 left-3 h-2 cursor-ns-resize" },
  { direction: "e", className: "top-3 right-0 bottom-3 w-2 cursor-ew-resize" },
  { direction: "w", className: "top-3 bottom-3 left-0 w-2 cursor-ew-resize" },
  { direction: "ne", className: "top-0 right-0 h-3 w-3 cursor-nesw-resize" },
  { direction: "nw", className: "top-0 left-0 h-3 w-3 cursor-nwse-resize" },
  { direction: "se", className: "right-0 bottom-0 h-3 w-3 cursor-nwse-resize" },
  { direction: "sw", className: "bottom-0 left-0 h-3 w-3 cursor-nesw-resize" },
];

export function getTerminalSizeBounds(
  terminalRef: RefObject<HTMLDivElement | null>,
) {
  const minimums = getTerminalMinimums();
  const parentElement = terminalRef.current?.parentElement;
  let parentContentWidth: number | null = null;
  let parentContentHeight: number | null = null;

  if (parentElement) {
    const parentStyles = window.getComputedStyle(parentElement);
    const paddingX =
      (Number.parseFloat(parentStyles.paddingLeft) || 0) +
      (Number.parseFloat(parentStyles.paddingRight) || 0);
    const paddingY =
      (Number.parseFloat(parentStyles.paddingTop) || 0) +
      (Number.parseFloat(parentStyles.paddingBottom) || 0);
    parentContentWidth = parentElement.clientWidth - paddingX;
    parentContentHeight = parentElement.clientHeight - paddingY;
  }

  const viewportMaxWidth =
    window.innerWidth - TERMINAL_LAYOUT.viewportMargin * 2;
  const parentMaxWidth = parentContentWidth
    ? Math.floor(parentContentWidth - TERMINAL_LAYOUT.viewportMargin * 2)
    : viewportMaxWidth;
  const maxWidth = Math.max(
    minimums.width,
    Math.min(viewportMaxWidth, Math.max(parentMaxWidth, minimums.width)),
  );

  const viewportMaxHeight = Math.max(
    minimums.height,
    window.innerHeight - TERMINAL_LAYOUT.maxViewportHeightOffset,
  );
  const parentMaxHeight = parentContentHeight
    ? Math.floor(parentContentHeight - TERMINAL_LAYOUT.viewportMargin * 2)
    : viewportMaxHeight;
  const maxHeight = Math.max(
    minimums.height,
    Math.min(viewportMaxHeight, Math.max(parentMaxHeight, minimums.height)),
  );

  return {
    minWidth: minimums.width,
    minHeight: minimums.height,
    maxWidth,
    maxHeight,
  };
}

export function beginPointerSession(
  onMove: (event: PointerEvent) => void,
  cursor: string,
) {
  const previousUserSelect = document.body.style.userSelect;
  const previousCursor = document.body.style.cursor;

  document.body.style.userSelect = "none";
  document.body.style.cursor = cursor;

  const handleMove = (event: PointerEvent) => onMove(event);
  const stopSession = () => {
    document.body.style.userSelect = previousUserSelect;
    document.body.style.cursor = previousCursor;
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", stopSession);
    window.removeEventListener("pointercancel", stopSession);
  };

  window.addEventListener("pointermove", handleMove);
  window.addEventListener("pointerup", stopSession, { once: true });
  window.addEventListener("pointercancel", stopSession, { once: true });
}
