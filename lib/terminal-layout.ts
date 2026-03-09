export const TERMINAL_LAYOUT = {
  viewportMargin: 12,
  maxViewportHeightOffset: 120,
  defaultDesktopMaxHeight: 450,
  resizeEnabledMinViewportWidth: 768,
  minimums: {
    width: 500,
    height: 400,
  },
} as const;

export function isTerminalResizeEnabled(viewportWidth: number) {
  return viewportWidth >= TERMINAL_LAYOUT.resizeEnabledMinViewportWidth;
}

export function getTerminalMinimums() {
  return TERMINAL_LAYOUT.minimums;
}
