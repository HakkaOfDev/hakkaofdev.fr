export type VisitorCountry = {
  country: string;
  unique_count: number;
  total_hits: number;
};

export type UniqueVisitorsResult = {
  total: number;
  last_30d: number;
  today: number;
};

export type TopPage = {
  slug: string;
  unique_visitors: number;
  total_hits: number;
};

export type VisitorBrowser = {
  browser: string;
  unique_count: number;
  total_hits: number;
};

export type VisitorReferrer = {
  host: string;
  unique_count: number;
  total_hits: number;
};

export type VisitorTrendPoint = {
  bucket: string; // ISO date (YYYY-MM-DD)
  unique_count: number;
  total_hits: number;
};

/**
 * Time-range identifier. `null` / "all" means all time.
 * Maps to a number of days passed to `*_range` RPCs.
 */
export type StatsRange = "today" | "7d" | "30d" | "90d" | "all";

export const STATS_RANGES: ReadonlyArray<StatsRange> = [
  "today",
  "7d",
  "30d",
  "90d",
  "all",
] as const;

/** Convert a range to the `p_days` parameter for `*_range` RPCs (null = all time). */
export function rangeToDays(range: StatsRange): number | null {
  switch (range) {
    case "today":
      return 1;
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "all":
      return null;
  }
}
