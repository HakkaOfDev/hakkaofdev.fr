import { useMemo, useState, useCallback } from "react";
import {
  COMMANDS,
  SPOTIFY_COMMANDS,
} from "@/components/commands/command-descriptors";

export type SuggestionGroup = "Work" | "Profile" | "Spotify" | "Commands";

export type Suggestion = {
  value: string;
  description?: string;
  group: SuggestionGroup;
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

const COMMAND_GROUP_MAP: Record<string, SuggestionGroup> = {
  projects: "Work",
  experiences: "Work",
  skills: "Profile",
  about: "Profile",
  education: "Profile",
  spotify: "Spotify",
};

function buildSuggestionPool(): Suggestion[] {
  const base: Suggestion[] = COMMANDS.map((c) => ({
    value: c.command,
    description: c.description,
    group: COMMAND_GROUP_MAP[c.command] ?? "Commands",
  }));

  const spotify: Suggestion[] = SPOTIFY_COMMANDS.map((c) => ({
    value: `spotify ${c.command}`,
    description: c.description,
    group: "Spotify" as const,
  }));

  // De-dupe by value (COMMANDS already includes "spotify").
  const map = new Map<string, Suggestion>();
  for (const s of [...base, ...spotify]) map.set(s.value, s);

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

    if (q === "spotify") {
      return allSuggestions.filter((s) => s.value.startsWith(q)).slice(0, 8);
    }

    if (q.startsWith("spotify ")) {
      return allSuggestions
        .filter((s) => s.value.startsWith("spotify "))
        .filter((s) => s.value.startsWith(q))
        .slice(0, 8);
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

    // Special case: bare "spotify" → append a space to drill into subcommands.
    if (q === "spotify") {
      setValue("spotify ");
      openPopover();
      return;
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

  /** Apply the currently highlighted suggestion. Returns `true` if the value
   *  was actually changed (i.e. it was a partial completion). Returns `false`
   *  when there's nothing to apply or the input already matches exactly, so
   *  the caller can fall through to submit. */
  const applyActiveSuggestion = useCallback((): boolean => {
    const s = suggestions[safeActiveIndex];
    if (!s) return false;

    // Value already matches — just close the popover and let Enter submit.
    if (value.trim().toLowerCase() === s.value) {
      closePopover();
      return false;
    }

    setValue(s.value);
    closePopover();
    return true;
  }, [suggestions, safeActiveIndex, value, setValue, closePopover]);

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
