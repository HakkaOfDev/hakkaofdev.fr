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

  const getBounds = useCallback(
    () => getTerminalSizeBounds(terminalRef),
    [terminalRef],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clampLayoutToBounds = () => {
      if (!isDesktopViewport || isMaximized || isMinimized) return;
      if (terminalWidth === null && terminalHeight === null) return;

      const { maxWidth, maxHeight } = getBounds();
      const nextLayout: { terminalWidth?: number; terminalHeight?: number } =
        {};

      if (typeof terminalWidth === "number" && terminalWidth > maxWidth) {
        nextLayout.terminalWidth = Math.round(maxWidth);
      }
      if (typeof terminalHeight === "number" && terminalHeight > maxHeight) {
        nextLayout.terminalHeight = Math.round(maxHeight);
      }
      if (!nextLayout.terminalWidth && !nextLayout.terminalHeight) return;
      setTerminalLayout(nextLayout);
    };

    clampLayoutToBounds();
    window.addEventListener("resize", clampLayoutToBounds);
    return () => window.removeEventListener("resize", clampLayoutToBounds);
  }, [
    getBounds,
    isDesktopViewport,
    isMaximized,
    isMinimized,
    setTerminalLayout,
    terminalHeight,
    terminalWidth,
  ]);

  const containerStyle = useMemo(() => {
    const nextStyle = {
      "--terminal-font-family": fontFamilyStack,
      "--terminal-zoom": String(fontScale / 100),
    } as CSSProperties;

    const minimums = getTerminalMinimums();
    const viewportMaxHeight = `calc(100dvh - ${TERMINAL_LAYOUT.maxViewportHeightOffset}px)`;

    if (isDesktopViewport) nextStyle.minWidth = `${minimums.width}px`;
    if (!isMinimized && isDesktopViewport)
      nextStyle.minHeight = `${minimums.height}px`;
    if (!isMinimized && (isMaximized || terminalHeight !== null)) {
      nextStyle.maxHeight = viewportMaxHeight;
    }
    if (isMaximized) {
      nextStyle.width = `calc(100% - ${TERMINAL_LAYOUT.viewportMargin * 2}px)`;
      nextStyle.height = viewportMaxHeight;
    } else if (isDesktopViewport) {
      if (terminalWidth) nextStyle.width = `${terminalWidth}px`;
      if (terminalHeight) nextStyle.height = `${terminalHeight}px`;
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

        beginPointerSession((moveEvent) => {
          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;
          const { minWidth, minHeight, maxWidth, maxHeight } = getBounds();

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
    [
      getBounds,
      isDesktopViewport,
      isLayoutInteractive,
      setTerminalLayout,
      terminalRef,
    ],
  );

  return {
    containerStyle,
    isDesktopViewport,
    isLayoutInteractive,
    resizeHandles: RESIZE_HANDLES,
    handleResizeStart,
  };
}
