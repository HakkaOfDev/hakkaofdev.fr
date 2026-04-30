import { useEffect } from "react";

interface UseGlobalShortcutsOptions {
  clearCommands: () => void;
  reset: () => void;
  setValue: (v: string) => void;
  resetHistory: () => void;
  closePopover: () => void;
  toggleSearch: () => void;
  canSearch: boolean;
  increaseFontScale: () => void;
  decreaseFontScale: () => void;
}

/**
 * Registers global keyboard shortcuts on the `window` so they fire
 * regardless of whether the terminal input is focused.
 *
 * - Ctrl + L → clear terminal output
 * - Ctrl + R → full reset (clear output + show welcome)
 * - Ctrl + F → toggle terminal output search
 * - Ctrl + +/- → zoom terminal text in/out
 *
 * Clear/reset shortcuts also clear the input value, reset command
 * history navigation, and close the suggestions popover.
 */
export function useGlobalShortcuts({
  clearCommands,
  reset,
  setValue,
  resetHistory,
  closePopover,
  toggleSearch,
  canSearch,
  increaseFontScale,
  decreaseFontScale,
}: UseGlobalShortcutsOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.metaKey) return;

      if (e.key === "l") {
        e.preventDefault();
        clearCommands();
        setValue("");
        resetHistory();
        closePopover();
        return;
      }

      if (e.key === "r") {
        e.preventDefault();
        reset();
        setValue("");
        resetHistory();
        closePopover();
        return;
      }

      if (e.key.toLowerCase() === "f") {
        if (!canSearch) return;
        e.preventDefault();
        closePopover();
        toggleSearch();
        return;
      }

      if (e.key === "=" || e.key === "+" || e.code === "NumpadAdd") {
        e.preventDefault();
        increaseFontScale();
        return;
      }

      if (e.key === "-" || e.code === "NumpadSubtract") {
        e.preventDefault();
        decreaseFontScale();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    clearCommands,
    reset,
    setValue,
    resetHistory,
    closePopover,
    toggleSearch,
    canSearch,
    increaseFontScale,
    decreaseFontScale,
  ]);
}
