import { useEffect } from "react";

interface UseGlobalShortcutsOptions {
  clearCommands: () => void;
  reset: () => void;
  setValue: (v: string) => void;
  resetHistory: () => void;
  closePopover: () => void;
}

/**
 * Registers global keyboard shortcuts on the `window` so they fire
 * regardless of whether the terminal input is focused.
 *
 * - Ctrl/Cmd + L → clear terminal output
 * - Ctrl/Cmd + R → full reset (clear output + show welcome)
 *
 * Both shortcuts also clear the input value, reset command history
 * navigation, and close the suggestions popover.
 */
export function useGlobalShortcuts({
  clearCommands,
  reset,
  setValue,
  resetHistory,
  closePopover,
}: UseGlobalShortcutsOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;

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
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [clearCommands, reset, setValue, resetHistory, closePopover]);
}
