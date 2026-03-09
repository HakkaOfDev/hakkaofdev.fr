"use client";

import {
  clampFontScale,
  clampScrollbackLimit,
  DEFAULT_FONT_SCALE,
  DEFAULT_SCROLLBACK_LIMIT,
  isTerminalFontId,
  SCROLLBACK_STORAGE_KEY,
  TERMINAL_PREFERENCES_STORAGE_KEY,
} from "@/lib/utils/terminal.utils";
import type { StoredTerminalPreferences, TerminalFontId } from "@/types/terminal";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NumberUpdater = number | ((previous: number) => number);

type TerminalPreferencesStore = {
  fontScale: number;
  fontFamily: TerminalFontId;
  scrollbackLimit: number;
  setFontScale: (value: NumberUpdater) => void;
  setFontFamily: (value: TerminalFontId) => void;
  setScrollbackLimit: (value: number) => void;
  resetPreferences: () => void;
};

function parseTerminalPreferences(
  input: unknown,
): Pick<
  StoredTerminalPreferences,
  "fontScale" | "fontFamily" | "scrollbackLimit"
> | null {
  if (!input || typeof input !== "object") return null;

  const maybe = input as Partial<StoredTerminalPreferences>;
  const fontScale =
    typeof maybe.fontScale === "number"
      ? clampFontScale(maybe.fontScale)
      : DEFAULT_FONT_SCALE;
  const fontFamily =
    typeof maybe.fontFamily === "string" && isTerminalFontId(maybe.fontFamily)
      ? maybe.fontFamily
      : "system";
  const scrollbackLimit =
    typeof maybe.scrollbackLimit === "number"
      ? clampScrollbackLimit(maybe.scrollbackLimit)
      : null;

  return {
    fontScale,
    fontFamily,
    scrollbackLimit:
      scrollbackLimit ?? loadLegacyScrollbackLimit() ?? DEFAULT_SCROLLBACK_LIMIT,
  };
}

function loadLegacyScrollbackLimit(): number | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SCROLLBACK_STORAGE_KEY);
    if (!raw) return null;
    return clampScrollbackLimit(Number(raw));
  } catch {
    return null;
  }
}

export const useTerminalPreferencesStore = create<TerminalPreferencesStore>()(
  persist(
    (set) => ({
      fontScale: DEFAULT_FONT_SCALE,
      fontFamily: "system",
      scrollbackLimit: DEFAULT_SCROLLBACK_LIMIT,
      setFontScale: (value) =>
        set((state) => ({
          fontScale: clampFontScale(
            typeof value === "function" ? value(state.fontScale) : value,
          ),
        })),
      setFontFamily: (value) => set({ fontFamily: value }),
      setScrollbackLimit: (value) =>
        set({ scrollbackLimit: clampScrollbackLimit(value) }),
      resetPreferences: () =>
        set({
          fontScale: DEFAULT_FONT_SCALE,
          fontFamily: "system",
          scrollbackLimit: DEFAULT_SCROLLBACK_LIMIT,
        }),
    }),
    {
      name: TERMINAL_PREFERENCES_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fontScale: state.fontScale,
        fontFamily: state.fontFamily,
        scrollbackLimit: state.scrollbackLimit,
      }),
      merge: (persistedState, currentState) => {
        const parsed = parseTerminalPreferences(persistedState);
        if (!parsed) return currentState;
        return { ...currentState, ...parsed };
      },
    },
  ),
);
