import { useCallback, useMemo, useState } from "react";
import type { CommandGroup } from "@/lib/command-descriptors";
import {
  buildSuggestionPool,
  calculateTabCompletion,
  filterSuggestions,
} from "@/lib/utils/suggestions.utils";
import { useAliasesStore } from "@/stores/aliases.store";

export type Suggestion = {
  value: string;
  /** Key under `Commands.descriptions.*` for the localized description, if any. */
  slug?: string;
  /** Pre-resolved description (e.g. an alias target). Takes priority over `slug`. */
  description?: string;
  group: CommandGroup;
  /** A flag awaiting its value: selecting it types `<value> ` instead of running. */
  needsValue?: boolean;
};

/**
 * Manages the autocomplete suggestion popover:
 * filtering, active-index tracking, tab-completion, and selection.
 */
export function useSuggestions(value: string, setValue: (v: string) => void) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const aliases = useAliasesStore((s) => s.aliases);
  const allSuggestions = useMemo(() => buildSuggestionPool(aliases), [aliases]);

  const suggestions = useMemo(() => {
    const query = value.toLowerCase().trimStart();
    return filterSuggestions(query, allSuggestions);
  }, [allSuggestions, value]);

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
    const query = value.toLowerCase().trimStart();
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
        break;
    }
  }, [value, suggestions, setValue, openPopover, closePopover]);

  // ── Selection ──────────────────────────────────────────────────────────

  const fillSuggestion = useCallback(
    (suggestion: Suggestion): boolean => {
      if (suggestion.needsValue) {
        setValue(`${suggestion.value} `);
        openPopover();
        return false;
      }
      setValue(suggestion.value);
      closePopover();
      return true;
    },
    [setValue, openPopover, closePopover],
  );

  /**
   * Apply the currently highlighted suggestion.
   * Returns its value and whether it can run now, or null if nothing to apply.
   */
  const applyActiveSuggestion = useCallback((): {
    value: string;
    run: boolean;
  } | null => {
    const suggestion = suggestions[safeActiveIndex];
    if (!suggestion) return null;

    return { value: suggestion.value, run: fillSuggestion(suggestion) };
  }, [suggestions, safeActiveIndex, fillSuggestion]);

  /**
   * Apply a specific suggestion by index (e.g., on click).
   */
  const applySuggestion = useCallback(
    (index: number) => {
      const suggestion = suggestions[index];
      if (suggestion) fillSuggestion(suggestion);
    },
    [suggestions, fillSuggestion],
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
