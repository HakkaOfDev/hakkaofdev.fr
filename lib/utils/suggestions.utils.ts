import { DYNAMIC_PARAM_COMMANDS } from "@/components/commands/registries/dynamic-param.registry";
import type { Suggestion } from "@/hooks/useSuggestions";
import {
  ALL_COMMANDS,
  COMMAND_FLAGS,
  SUBCOMMAND_PREFIXES,
} from "@/lib/command-descriptors";
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
 * Suggestions for `--flag <value>` arguments (see `COMMAND_FLAGS`):
 * - `stats `            → sub-commands + flags
 * - `stats countries -` → matching flags not used yet
 * - `stats --last 3`    → values for `--last`
 * - `stats --last 7d `  → sub-commands still available after flags
 * Returns null when the query isn't about flags, so other matchers run.
 */
export function getFlagSuggestions(
  query: string,
  allSuggestions: Suggestion[],
): Suggestion[] | null {
  if (query.includes("|")) return null;

  const tokens = query.split(" ");
  const [base] = tokens;
  const flags = COMMAND_FLAGS.filter((f) => f.command === base);
  if (tokens.length < 2 || flags.length === 0) return null;

  const current = tokens[tokens.length - 1];
  const previous = tokens[tokens.length - 2];
  const head = `${tokens.slice(0, -1).join(" ")} `;
  const args = tokens.slice(1, -1).filter(Boolean);

  const valueFlag = flags.find((f) => f.flag === previous);
  if (valueFlag) {
    return valueFlag.values
      .filter((v) => v.startsWith(current))
      .map((v) => ({ value: head + v, group: valueFlag.group }))
      .slice(0, MAX_SUGGESTIONS);
  }

  const flagSuggestions: Suggestion[] = flags
    .filter((f) => !args.includes(f.flag) && f.flag.startsWith(current))
    .map((f) => ({
      value: head + f.flag,
      slug: f.slug,
      group: f.group,
      needsValue: f.values.length > 0,
    }));

  if (current.startsWith("-")) return flagSuggestions.slice(0, MAX_SUGGESTIONS);

  const isFlagValue = (i: number) => flags.some((f) => f.flag === args[i - 1]);
  const hasFlag = args.some((t) => t.startsWith("-"));
  const hasSubcommand = args.some(
    (t, i) => !t.startsWith("-") && !isFlagValue(i),
  );

  const subcommands: Suggestion[] = hasSubcommand
    ? []
    : allSuggestions
        .filter((s) => s.value.startsWith(`${base} `))
        .map((s) => ({ ...s, value: head + s.value.slice(base.length + 1) }))
        .filter((s) => s.value.startsWith(query));

  if (current === "") {
    return [...subcommands, ...flagSuggestions].slice(0, MAX_SUGGESTIONS);
  }
  return hasFlag ? subcommands.slice(0, MAX_SUGGESTIONS) : null;
}

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

    if (query === pattern) {
      return allSuggestions
        .filter((s) => s.value === pattern)
        .slice(0, MAX_SUGGESTIONS);
    }

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
    if (query === prefix) {
      return allSuggestions
        .filter((s) => s.value.startsWith(query))
        .slice(0, MAX_SUGGESTIONS);
    }

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

  const flagSuggestions = getFlagSuggestions(query, allSuggestions);
  if (flagSuggestions !== null) return flagSuggestions;

  const dynamicSuggestions = getDynamicParamSuggestions(query, allSuggestions);
  if (dynamicSuggestions !== null) return dynamicSuggestions;

  const subcommandSuggestions = getSubcommandSuggestions(query, allSuggestions);
  if (subcommandSuggestions !== null) return subcommandSuggestions;

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
  suggestions: Suggestion[],
): TabCompletionResult {
  if (suggestions.length === 0) return { type: "no_action" };

  if (suggestions.length === 1) {
    const [only] = suggestions;
    return only.needsValue
      ? { type: "add_space", value: `${only.value} ` }
      : { type: "complete_single", value: only.value };
  }

  const lcp = longestCommonPrefix(suggestions.map((s) => s.value));
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

  const dynamicSpace = checkDynamicParamSpace(query);
  if (dynamicSpace) return { type: "add_space", value: dynamicSpace };

  const subcommandSpace = checkSubcommandSpace(query);
  if (subcommandSpace) return { type: "add_space", value: subcommandSpace };

  return completeFromMatches(query, suggestions);
}
