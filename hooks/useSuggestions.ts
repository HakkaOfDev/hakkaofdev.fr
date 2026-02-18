import { useCallback, useMemo, useState } from "react";
import {
  ALL_COMMANDS,
  type CommandGroup,
  SUBCOMMAND_PREFIXES,
} from "@/components/commands/command-descriptors";

export type Suggestion = {
  value: string;
  description?: string;
  group: CommandGroup;
};

// ─── Helpers ───────────────────────────────────────────────────────────

function longestCommonPrefix(items: string[]): string {
  if (items.length === 0) return "";
  let prefix = items[0];
  for (const item of items) {
    while (prefix && !item.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
    }
    if (!prefix) return "";
  }
  return prefix;
}

function buildSuggestionPool(): Suggestion[] {
  const map = new Map<string, Suggestion>();
  for (const c of ALL_COMMANDS) {
    map.set(c.command, {
      value: c.command,
      description: c.description,
      group: c.group,
    });
  }

  return Array.from(map.values()).sort((a, b) =>
    a.value.localeCompare(b.value),
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────

/**
 * Manages the autocomplete suggestion popover:
 * filtering, active-index tracking, tab-completion, and selection.
 */
export function useSuggestions(value: string, setValue: (v: string) => void) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const allSuggestions = useMemo(() => buildSuggestionPool(), []);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [] as Suggestion[];

    for (const prefix of SUBCOMMAND_PREFIXES) {
      if (q === prefix) {
        return allSuggestions.filter((s) => s.value.startsWith(q)).slice(0, 8);
      }
      if (q.startsWith(`${prefix} `)) {
        return allSuggestions
          .filter((s) => s.value.startsWith(`${prefix} `))
          .filter((s) => s.value.startsWith(q))
          .slice(0, 8);
      }
    }

    return allSuggestions.filter((s) => s.value.startsWith(q)).slice(0, 8);
  }, [allSuggestions, value]);

  const isOpen = value.trim().length > 0 && suggestions.length > 0 && open;
  const safeActiveIndex = Math.max(
    0,
    Math.min(activeIndex, Math.max(0, suggestions.length - 1)),
  );

  // ── Actions ────────────────────────────────────────────────────────

  const openPopover = useCallback(() => {
    setOpen(true);
    setActiveIndex(0);
  }, []);

  const closePopover = useCallback(() => {
    setOpen(false);
    setActiveIndex(0);
  }, []);

  const moveActiveIndex = useCallback(
    (delta: number) => {
      setActiveIndex((i) => {
        const next = i + delta;
        return Math.max(0, Math.min(suggestions.length - 1, next));
      });
    },
    [suggestions.length],
  );

  const applyTabCompletion = useCallback(() => {
    const q = value.trim().toLowerCase();
    if (!q) return;

    for (const prefix of SUBCOMMAND_PREFIXES) {
      if (q === prefix) {
        setValue(`${prefix} `);
        openPopover();
        return;
      }
    }

    const matches = suggestions.map((s) => s.value);
    if (matches.length === 0) return;

    if (matches.length === 1) {
      setValue(matches[0]);
      closePopover();
      return;
    }

    const lcp = longestCommonPrefix(matches);
    if (lcp && lcp !== q) {
      setValue(lcp);
      openPopover();
    }
  }, [value, suggestions, setValue, openPopover, closePopover]);

  /** Resolve the currently highlighted suggestion and close the popover.
   *  Returns the suggestion value so the caller can submit it directly,
   *  or `null` when there's nothing to apply. */
  const applyActiveSuggestion = useCallback((): string | null => {
    const s = suggestions[safeActiveIndex];
    if (!s) return null;

    setValue(s.value);
    closePopover();
    return s.value;
  }, [suggestions, safeActiveIndex, setValue, closePopover]);

  /** Pick a specific suggestion by index (e.g. on click). */
  const applySuggestion = useCallback(
    (index: number) => {
      const s = suggestions[index];
      if (!s) return;
      setValue(s.value);
      closePopover();
    },
    [suggestions, setValue, closePopover],
  );

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
