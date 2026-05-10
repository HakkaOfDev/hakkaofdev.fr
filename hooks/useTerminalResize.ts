import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getTerminalMinimums,
  isTerminalResizeEnabled,
  TERMINAL_LAYOUT,
} from "@/lib/terminal-layout";
import { clamp } from "@/lib/utils/terminal.utils";
import {
  beginPointerSession,
  getTerminalSizeBounds,
  RESIZE_HANDLES,
} from "@/lib/utils/terminal-resize.utils";
import type { ResizeDirection } from "@/types/terminal";

interface UseTerminalResizeOptions {
  terminalRef: RefObject<HTMLDivElement | null>;
  isMinimized: boolean;
  isMaximized: boolean;
  fontFamilyStack: string;
  fontScale: number;
  terminalWidth: number | null;
  terminalHeight: number | null;
  setTerminalLayout: (layout: {
    terminalWidth?: number | null;
    terminalHeight?: number | null;
  }) => void;
}

export function useTerminalResize({
  terminalRef,
  isMinimized,
  isMaximized,
  fontFamilyStack,
  fontScale,
  terminalWidth,
  terminalHeight,
  setTerminalLayout,
}: UseTerminalResizeOptions) {
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const isLayoutInteractive = !isMaximized && !isMinimized;

  useEffect(() => {
    const updateViewportMode = () => {
      setIsDesktopViewport(isTerminalResizeEnabled(window.innerWidth));
    };
    updateViewportMode();
    window.addEventListener("resize", updateViewportMode);
    return () => window.removeEventListener("resize", updateViewportMode);
  }, []);

  const containerStyle = useMemo(() => {
    const nextStyle = {
      "--terminal-font-family": fontFamilyStack,
      "--terminal-zoom": String(fontScale / 100),
    } as CSSProperties;

    const minimums = getTerminalMinimums();
    const viewportMaxHeight = `calc(100dvh - ${TERMINAL_LAYOUT.maxViewportHeightOffset}px)`;
    const parentMaxWidth = `calc(100% - ${TERMINAL_LAYOUT.viewportMargin * 2}px)`;

    if (isDesktopViewport) nextStyle.minWidth = `${minimums.width}px`;
    if (!isMinimized && isDesktopViewport)
      nextStyle.minHeight = `${minimums.height}px`;
    if (isMaximized) {
      nextStyle.width = parentMaxWidth;
      nextStyle.height = viewportMaxHeight;
      nextStyle.maxWidth = parentMaxWidth;
      nextStyle.maxHeight = viewportMaxHeight;
    } else if (isDesktopViewport) {
      if (terminalWidth) {
        nextStyle.width = `${terminalWidth}px`;
        nextStyle.maxWidth = parentMaxWidth;
      }
      if (terminalHeight) {
        nextStyle.height = `${terminalHeight}px`;
        nextStyle.maxHeight = viewportMaxHeight;
      }
    }

    return nextStyle;
  }, [
    fontFamilyStack,
    fontScale,
    isDesktopViewport,
    isMaximized,
    isMinimized,
    terminalHeight,
    terminalWidth,
  ]);

  const handleResizeStart = useCallback(
    (direction: ResizeDirection) =>
      (event: ReactPointerEvent<HTMLSpanElement>) => {
        if (!isLayoutInteractive || !isDesktopViewport || event.button !== 0)
          return;
        const terminalEl = terminalRef.current;
        if (!terminalEl) return;

        const startRect = terminalEl.getBoundingClientRect();
        const startX = event.clientX;
        const startY = event.clientY;
        const sessionBounds = getTerminalSizeBounds(terminalRef);

        beginPointerSession((moveEvent) => {
          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;
          const { minWidth, minHeight, maxWidth, maxHeight } = sessionBounds;

          let nextWidth = startRect.width;
          let nextHeight = startRect.height;
          if (direction.includes("e")) nextWidth += deltaX;
          if (direction.includes("w")) nextWidth -= deltaX;
          if (direction.includes("s")) nextHeight += deltaY;
          if (direction.includes("n")) nextHeight -= deltaY;

          setTerminalLayout({
            terminalWidth: Math.round(clamp(nextWidth, minWidth, maxWidth)),
            terminalHeight: Math.round(clamp(nextHeight, minHeight, maxHeight)),
          });
        }, "nwse-resize");

        event.preventDefault();
      },
    [isDesktopViewport, isLayoutInteractive, setTerminalLayout, terminalRef],
  );

  return {
    containerStyle,
    isDesktopViewport,
    isLayoutInteractive,
    resizeHandles: RESIZE_HANDLES,
    handleResizeStart,
  };
}
