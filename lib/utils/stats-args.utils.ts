import type { StatsRange } from "@/types/analytics";
import { STATS_RANGES } from "@/types/analytics";

export type ParsedStatsArgs = {
  /** Sub-command name after `stats`, if any (e.g., "pages", "countries"). */
  subcommand: string | null;
  /** Selected time range (defaults to null = "use the command's default"). */
  range: StatsRange | null;
  /** Unknown / invalid flags reported back to the UI for diagnostics. */
  unknown: string[];
  /** Positional args after the sub-command (currently unused, reserved). */
  positional: string[];
};

const RANGE_SET = new Set<StatsRange>(STATS_RANGES);
const RANGE_ALIASES: Record<string, StatsRange> = {
  "1d": "today",
  "24h": "today",
  day: "today",
  today: "today",
  week: "7d",
  "7d": "7d",
  "30d": "30d",
  month: "30d",
  "1m": "30d",
  "90d": "90d",
  quarter: "90d",
  all: "all",
  "*": "all",
};

function normalizeRange(raw: string): StatsRange | null {
  const lower = raw.trim().toLowerCase();
  const aliased = RANGE_ALIASES[lower];
  if (aliased) return aliased;
  return RANGE_SET.has(lower as StatsRange) ? (lower as StatsRange) : null;
}

/**
 * Parse a `stats ...` invocation into its sub-command, range flag, and any
 * positional / unknown tokens. Accepts both `--last 7d` and `--last=7d`, plus
 * shortcuts like `--7d`, `--month`, `--today`.
 */
export function parseStatsArgs(input: string): ParsedStatsArgs {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  // tokens[0] is "stats" itself
  const args = tokens.slice(1);

  let subcommand: string | null = null;
  let range: StatsRange | null = null;
  const unknown: string[] = [];
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const token = args[i] ?? "";

    if (token === "--last" || token.startsWith("--last=")) {
      const value = token.includes("=") ? token.split("=")[1] : args[++i];
      if (!value) {
        unknown.push("--last");
        continue;
      }
      const normalized = normalizeRange(value);
      if (normalized) range = normalized;
      else unknown.push(`--last ${value}`);
      continue;
    }

    if (token.startsWith("--")) {
      const stripped = token.slice(2);
      const normalized = normalizeRange(stripped);
      if (normalized) {
        range = normalized;
      } else {
        unknown.push(token);
      }
      continue;
    }

    if (subcommand === null) {
      subcommand = token.toLowerCase();
    } else {
      positional.push(token);
    }
  }

  return { subcommand, range, unknown, positional };
}
