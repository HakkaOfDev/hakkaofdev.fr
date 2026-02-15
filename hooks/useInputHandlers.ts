import { useCallback } from "react";

interface UseInputHandlersOptions {
  value: string;
  setValue: (v: string) => void;
  addCommand: (input: string) => void;
  // History
  navigateHistory: (delta: number) => void;
  resetHistory: () => void;
  // Suggestions
  isOpen: boolean;
  activeIndex: number;
  suggestionsCount: number;
  openPopover: () => void;
  closePopover: () => void;
  moveActiveIndex: (delta: number) => void;
  applyTabCompletion: () => void;
  applyActiveSuggestion: () => boolean;
  hasSuggestions: boolean;
}

/**
 * Orchestrates all input event handlers (keydown, submit, change, focus)
 * by composing actions from the history and suggestions hooks.
 */
export function useInputHandlers({
  value,
  setValue,
  addCommand,
  navigateHistory,
  resetHistory,
  isOpen,
  activeIndex,
  suggestionsCount,
  openPopover,
  closePopover,
  moveActiveIndex,
  applyTabCompletion,
  applyActiveSuggestion,
  hasSuggestions,
}: UseInputHandlersOptions) {
  const submit = useCallback(() => {
    if (value === "") return;
    addCommand(value);
    setValue("");
    resetHistory();
    closePopover();
    if (window.innerWidth <= 768) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }, [value, addCommand, setValue, resetHistory, closePopover]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submit();
    },
    [submit],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Ctrl/Cmd + P/N → history navigation
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "n")) {
        e.preventDefault();
        navigateHistory(e.key === "p" ? 1 : -1);
        return;
      }

      // Tab → autocomplete
      if (e.key === "Tab") {
        e.preventDefault();
        applyTabCompletion();
        return;
      }

      // Arrow Up
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (isOpen && activeIndex > 0) {
          moveActiveIndex(-1);
        } else {
          if (isOpen) closePopover();
          navigateHistory(1);
        }
        return;
      }

      // Arrow Down
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (isOpen && activeIndex < suggestionsCount - 1) {
          moveActiveIndex(1);
        } else {
          if (isOpen) closePopover();
          navigateHistory(-1);
        }
        return;
      }

      // Escape → close popover
      if (e.key === "Escape") {
        if (!isOpen) return;
        e.preventDefault();
        closePopover();
        return;
      }

      // Enter → apply suggestion or submit
      if (e.key === "Enter") {
        e.preventDefault();
        if (isOpen && applyActiveSuggestion()) return;
        submit();
      }
    },
    [
      isOpen,
      activeIndex,
      suggestionsCount,
      navigateHistory,
      applyTabCompletion,
      moveActiveIndex,
      closePopover,
      applyActiveSuggestion,
      submit,
    ],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value.toLowerCase());
      resetHistory();
      openPopover();
    },
    [setValue, resetHistory, openPopover],
  );

  const handleFocus = useCallback(() => {
    if (value.trim().length > 0 && hasSuggestions) {
      openPopover();
    }
  }, [value, hasSuggestions, openPopover]);

  return { handleSubmit, handleKeyDown, handleChange, handleFocus } as const;
}
