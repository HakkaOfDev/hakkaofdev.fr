import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCommands } from "@/components/providers/CommandsProvider";
import { CLOSE_MESSAGES } from "@/lib/constants";
import {
  getTerminalMinimums,
  isTerminalResizeEnabled,
} from "@/lib/terminal-layout";
import {
  clampFontScale,
  clampScrollbackLimit,
  DEFAULT_FONT_SCALE,
  DEFAULT_SCROLLBACK_LIMIT,
  FONT_SCALE_STEP,
  isTerminalFontId,
  TERMINAL_FONT_OPTIONS,
} from "@/lib/utils/terminal.utils";
import { useTerminalPreferencesStore } from "@/stores/terminal-preferences.store";
import { useTerminalSessionsStore } from "@/stores/terminal-sessions.store";

export function useTerminalState() {
  const { addCommand, commands } = useCommands();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const {
    fontScale,
    setFontScale,
    fontFamily,
    setFontFamilyState,
    scrollbackLimit,
    setScrollbackLimitState,
  } = useTerminalPreferencesStore(
    useShallow((state) => ({
      fontScale: state.fontScale,
      setFontScale: state.setFontScale,
      fontFamily: state.fontFamily,
      setFontFamilyState: state.setFontFamily,
      scrollbackLimit: state.scrollbackLimit,
      setScrollbackLimitState: state.setScrollbackLimit,
    })),
  );
  const trimCommandsToScrollback = useTerminalSessionsStore(
    (state) => state.trimCommandsToScrollback,
  );

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [outputQuery, setOutputQuery] = useState("");
  const [terminalWidth, setTerminalWidth] = useState<number | null>(null);
  const [terminalHeight, setTerminalHeight] = useState<number | null>(null);
  const canSearch = commands.length > 0;

  const fontOptions = useMemo(
    () => TERMINAL_FONT_OPTIONS.map(({ id, label }) => ({ id, label })),
    [],
  );

  const fontFamilyStack = useMemo(
    () =>
      TERMINAL_FONT_OPTIONS.find((option) => option.id === fontFamily)?.stack ??
      TERMINAL_FONT_OPTIONS[0].stack,
    [fontFamily],
  );

  const handleClose = useCallback(() => {
    if (isMinimized) setIsMinimized(false);
    const message =
      CLOSE_MESSAGES[Math.floor(Math.random() * CLOSE_MESSAGES.length)];
    addCommand(`echo "${message}"`);
  }, [addCommand, isMinimized]);

  const handleMinimize = useCallback(() => {
    setIsMinimized((value) => {
      const next = !value;
      if (next) setIsMaximized(false);
      return next;
    });
  }, []);

  const handleMaximize = useCallback(() => {
    if (isMinimized) setIsMinimized(false);
    setIsMaximized((value) => !value);
  }, [isMinimized]);

  const increaseFontScale = useCallback(() => {
    setFontScale((value) => clampFontScale(value + FONT_SCALE_STEP));
  }, [setFontScale]);

  const decreaseFontScale = useCallback(() => {
    setFontScale((value) => clampFontScale(value - FONT_SCALE_STEP));
  }, [setFontScale]);

  const resetFontScale = useCallback(() => {
    setFontScale(DEFAULT_FONT_SCALE);
  }, [setFontScale]);

  const setFontFamily = useCallback(
    (fontId: string) => {
      if (!isTerminalFontId(fontId)) return;
      setFontFamilyState(fontId);
    },
    [setFontFamilyState],
  );

  const resetPreferences = useCallback(() => {
    setFontScale(DEFAULT_FONT_SCALE);
    setFontFamilyState("system");
  }, [setFontScale, setFontFamilyState]);

  const setScrollbackLimit = useCallback(
    (value: number) => {
      const nextLimit = clampScrollbackLimit(value);
      setScrollbackLimitState(nextLimit);
      trimCommandsToScrollback(nextLimit);
    },
    [setScrollbackLimitState, trimCommandsToScrollback],
  );

  const resetScrollbackLimit = useCallback(() => {
    setScrollbackLimit(DEFAULT_SCROLLBACK_LIMIT);
  }, [setScrollbackLimit]);

  const openSearch = useCallback(() => {
    if (!canSearch) return;
    setIsSearchOpen(true);
  }, [canSearch]);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setOutputQuery("");
  }, []);

  const toggleSearch = useCallback(() => {
    if (!canSearch) return;
    setIsSearchOpen((value) => {
      if (value) setOutputQuery("");
      return !value;
    });
  }, [canSearch]);

  useEffect(() => {
    if (canSearch) return;
    setIsSearchOpen(false);
    setOutputQuery("");
  }, [canSearch]);

  const setTerminalLayout = useCallback(
    (layout: {
      terminalWidth?: number | null;
      terminalHeight?: number | null;
    }) => {
      if (typeof window === "undefined") return;
      if (!isTerminalResizeEnabled(window.innerWidth)) return;

      const minimums = getTerminalMinimums();
      if (layout.terminalWidth !== undefined) {
        const next = layout.terminalWidth;
        setTerminalWidth(
          typeof next === "number" && next > 0
            ? Math.max(minimums.width, Math.round(next))
            : null,
        );
      }
      if (layout.terminalHeight !== undefined) {
        const next = layout.terminalHeight;
        setTerminalHeight(
          typeof next === "number" && next > 0
            ? Math.max(minimums.height, Math.round(next))
            : null,
        );
      }
    },
    [],
  );

  const resetTerminalLayout = useCallback(() => {
    setTerminalWidth(null);
    setTerminalHeight(null);
  }, []);

  return {
    isMinimized,
    isMaximized,
    handleClose,
    handleMinimize,
    handleMaximize,
    fontScale,
    increaseFontScale,
    decreaseFontScale,
    resetFontScale,
    fontFamily,
    setFontFamily,
    resetPreferences,
    scrollbackLimit,
    setScrollbackLimit,
    resetScrollbackLimit,
    fontFamilyStack,
    fontOptions,
    isSearchOpen,
    canSearch,
    outputQuery,
    setOutputQuery,
    openSearch,
    closeSearch,
    toggleSearch,
    terminalWidth,
    terminalHeight,
    setTerminalLayout,
    resetTerminalLayout,
  };
}
