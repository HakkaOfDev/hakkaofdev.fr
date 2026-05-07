import { DYNAMIC_PARAM_COMMANDS } from "@/components/commands/registries/dynamic-param.registry";
import type { Suggestion } from "@/hooks/useSuggestions";
import { ALL_COMMANDS, SUBCOMMAND_PREFIXES } from "@/lib/command-descriptors";
import type { AliasMap } from "@/stores/aliases.store";
import type { TabCompletionResult } from "@/types/suggestions";
import { MAX_SUGGESTIONS } from "../constants/suggestions.constants";

// ─── Helpers ───────────────────────────────────────────────────────────

export function longestCommonPrefix(items: string[]): string {
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

export function buildSuggestionPool(aliases?: AliasMap): Suggestion[] {
  const map = new Map<string, Suggestion>();
  for (const c of ALL_COMMANDS) {
    map.set(c.command, {
      value: c.command,
      slug: c.slug,
      group: c.group,
    });
  }

  if (aliases) {
    for (const [name, value] of Object.entries(aliases)) {
      // Built-ins always win — never let an alias replace a real command.
      if (map.has(name)) continue;
      map.set(name, {
        value: name,
        group: "Terminal",
        description: `→ ${value}`,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.value.localeCompare(b.value),
  );
}

// ─── Filtering Logic ───────────────────────────────────────────────────

/**
 * Try to get suggestions for dynamic parameter commands.
 * Returns suggestions if the query matches a dynamic pattern, null otherwise.
 */
export function getDynamicParamSuggestions(
  query: string,
  allSuggestions: Suggestion[],
): Suggestion[] | null {
  for (const dynConfig of DYNAMIC_PARAM_COMMANDS) {
    const pattern = dynConfig.pattern.toLowerCase();

    // If user typed exactly the pattern (e.g., "theme set")
    if (query === pattern) {
      return allSuggestions
        .filter((s) => s.value === pattern)
        .slice(0, MAX_SUGGESTIONS);
    }

    // If user typed pattern + space + param (e.g., "theme set d")
    if (query.startsWith(`${pattern} `)) {
      const paramQuery = query.slice(pattern.length + 1);

      try {
        const params = dynConfig.paramProvider();
        return params
          .filter((param) => param.toLowerCase().startsWith(paramQuery))
          .map((param) => ({
            value: `${pattern} ${param}`,
            slug: undefined,
            group: dynConfig.group,
          }))
          .slice(0, MAX_SUGGESTIONS);
      } catch (error) {
        console.error(`Error getting params for ${pattern}:`, error);
        return [];
      }
    }
  }

  return null;
}

/**
 * Try to get suggestions for subcommand prefixes.
 * Returns suggestions if the query matches a subcommand, null otherwise.
 */
export function getSubcommandSuggestions(
  query: string,
  allSuggestions: Suggestion[],
): Suggestion[] | null {
  for (const prefix of SUBCOMMAND_PREFIXES) {
    // If user typed exactly the prefix (e.g., "spotify")
    if (query === prefix) {
      return allSuggestions
        .filter((s) => s.value.startsWith(query))
        .slice(0, MAX_SUGGESTIONS);
    }

    // If user typed prefix + space + subcommand (e.g., "spotify n")
    if (query.startsWith(`${prefix} `)) {
      return allSuggestions
        .filter((s) => s.value.startsWith(`${prefix} `))
        .filter((s) => s.value.startsWith(query))
        .slice(0, MAX_SUGGESTIONS);
    }
  }

  return null;
}

/**
 * Get default prefix-based suggestions.
 */
export function getDefaultSuggestions(
  query: string,
  allSuggestions: Suggestion[],
): Suggestion[] {
  return allSuggestions
    .filter((s) => s.value.startsWith(query))
    .slice(0, MAX_SUGGESTIONS);
}

/**
 * Filter suggestions based on the query.
 * Tries dynamic params first, then subcommands, then default filtering.
 */
export function filterSuggestions(
  query: string,
  allSuggestions: Suggestion[],
): Suggestion[] {
  if (!query) return [];

  // Try dynamic parameter commands
  const dynamicSuggestions = getDynamicParamSuggestions(query, allSuggestions);
  if (dynamicSuggestions !== null) return dynamicSuggestions;

  // Try subcommand prefixes
  const subcommandSuggestions = getSubcommandSuggestions(query, allSuggestions);
  if (subcommandSuggestions !== null) return subcommandSuggestions;

  // Default filtering
  return getDefaultSuggestions(query, allSuggestions);
}

// ─── Tab Completion Logic ──────────────────────────────────────────────

/**
 * Check if query matches a dynamic parameter pattern that needs a space.
 */
function checkDynamicParamSpace(query: string): string | null {
  for (const dynConfig of DYNAMIC_PARAM_COMMANDS) {
    const pattern = dynConfig.pattern.toLowerCase();
    if (query === pattern) {
      return `${pattern} `;
    }
  }
  return null;
}

/**
 * Check if query matches a subcommand prefix that needs a space.
 */
function checkSubcommandSpace(query: string): string | null {
  for (const prefix of SUBCOMMAND_PREFIXES) {
    if (query === prefix) {
      return `${prefix} `;
    }
  }
  return null;
}

/**
 * Try to complete from a list of matches.
 */
function completeFromMatches(
  query: string,
  matches: string[],
): TabCompletionResult {
  if (matches.length === 0) return { type: "no_action" };

  if (matches.length === 1) {
    return { type: "complete_single", value: matches[0] };
  }

  const lcp = longestCommonPrefix(matches);
  if (lcp && lcp !== query) {
    return { type: "complete_prefix", value: lcp };
  }

  return { type: "no_action" };
}

/**
 * Calculate what tab completion should do.
 */
export function calculateTabCompletion(
  query: string,
  suggestions: Suggestion[],
): TabCompletionResult {
  if (!query) return { type: "no_action" };

  // Check if we need to add a space after a pattern/prefix
  const dynamicSpace = checkDynamicParamSpace(query);
  if (dynamicSpace) return { type: "add_space", value: dynamicSpace };

  const subcommandSpace = checkSubcommandSpace(query);
  if (subcommandSpace) return { type: "add_space", value: subcommandSpace };

  // Try to complete from current suggestions
  const matches = suggestions.map((s) => s.value);
  return completeFromMatches(query, matches);
}
