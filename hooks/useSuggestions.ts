import { useCallback, useMemo, useState } from "react";
import type { CommandGroup } from "@/lib/command-descriptors";
import {
  buildSuggestionPool,
  calculateTabCompletion,
  filterSuggestions,
} from "@/lib/utils/suggestions.utils";

export type Suggestion = {
  value: string;
  description?: string;
  group: CommandGroup;
};

/**
 * Manages the autocomplete suggestion popover:
 * filtering, active-index tracking, tab-completion, and selection.
 */
export function useSuggestions(value: string, setValue: (v: string) => void) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Build the pool of all available suggestions once
  const allSuggestions = useMemo(() => buildSuggestionPool(), []);

  // Filter suggestions based on current input
  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    return filterSuggestions(query, allSuggestions);
  }, [allSuggestions, value]);

  // Derived state
  const isOpen = value.trim().length > 0 && suggestions.length > 0 && open;
  const safeActiveIndex = Math.max(
    0,
    Math.min(activeIndex, Math.max(0, suggestions.length - 1)),
  );

  // ── Popover Control ────────────────────────────────────────────────────

  const openPopover = useCallback(() => {
    setOpen(true);
    setActiveIndex(0);
  }, []);

  const closePopover = useCallback(() => {
    setOpen(false);
    setActiveIndex(0);
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────

  const moveActiveIndex = useCallback(
    (delta: number) => {
      setActiveIndex((i) => {
        const next = i + delta;
        return Math.max(0, Math.min(suggestions.length - 1, next));
      });
    },
    [suggestions.length],
  );

  // ── Tab Completion ─────────────────────────────────────────────────────

  const applyTabCompletion = useCallback(() => {
    const query = value.trim().toLowerCase();
    const result = calculateTabCompletion(query, suggestions);

    switch (result.type) {
      case "add_space":
        setValue(result.value);
        openPopover();
        break;

      case "complete_single":
        setValue(result.value);
        closePopover();
        break;

      case "complete_prefix":
        setValue(result.value);
        openPopover();
        break;

      case "no_action":
        // Do nothing
        break;
    }
  }, [value, suggestions, setValue, openPopover, closePopover]);

  // ── Selection ──────────────────────────────────────────────────────────

  /**
   * Apply the currently highlighted suggestion.
   * Returns the suggestion value or null if nothing to apply.
   */
  const applyActiveSuggestion = useCallback((): string | null => {
    const suggestion = suggestions[safeActiveIndex];
    if (!suggestion) return null;

    setValue(suggestion.value);
    closePopover();
    return suggestion.value;
  }, [suggestions, safeActiveIndex, setValue, closePopover]);

  /**
   * Apply a specific suggestion by index (e.g., on click).
   */
  const applySuggestion = useCallback(
    (index: number) => {
      const suggestion = suggestions[index];
      if (!suggestion) return;

      setValue(suggestion.value);
      closePopover();
    },
    [suggestions, setValue, closePopover],
  );

  // ── Return ─────────────────────────────────────────────────────────────

  return {
    suggestions,
    isOpen,
    safeActiveIndex,
    openPopover,
    closePopover,
    moveActiveIndex,
    applyTabCompletion,
    applyActiveSuggestion,
    applySuggestion,
  } as const;
}
