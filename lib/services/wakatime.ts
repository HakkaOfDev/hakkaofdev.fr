import { REVALIDATE, WAKATIME_API } from "@/lib/constants/api.constants";
import { rangeToDays, type StatsRange } from "@/types/analytics";
import type { WakaTimeStats } from "@/types/stats";

// ─── Types ───────────────────────────────────────────────────────────────────

type Language = { name: string; total_seconds: number };

/** WakaTime answers 202 with partial numbers while it (re)computes all-time stats. */
type Freshness = { is_up_to_date?: boolean; percent_calculated?: number };

type UserResponse = { data?: { timezone?: string } };

type AllTimeResponse = { data?: Freshness & { text?: string } };

type AllTimeStatsResponse = {
  data?: Freshness & {
    human_readable_daily_average?: string;
    languages?: Array<Language & { percent: number }>;
  };
};

type SummariesResponse = {
  data?: Array<{ languages?: Language[] }>;
  cumulative_total?: { text?: string };
  daily_average?: { text?: string };
};

// ─── Constants ───────────────────────────────────────────────────────────────

const EMPTY_STATS: WakaTimeStats = {
  codingTime: null,
  dailyAverage: null,
  topLanguage: null,
  calculatingPercent: null,
};

/** WakaTime's bucket for untyped files (AI agents, terminals); not a language. */
const UNCATEGORIZED_LANGUAGE = "Other";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatLanguage(name: string, percent: number): string {
  return `${name} (${percent.toFixed(0)}%)`;
}

/**
 * Most-used language (percent = share of all tracked time). Prefers a real
 * language over "Other", which only wins when nothing else was tracked.
 */
function pickTopLanguage(
  languages: Array<{ name: string; percent: number }>,
): string | null {
  const sorted = [...languages].sort((a, b) => b.percent - a.percent);
  const top =
    sorted.find((lang) => lang.name !== UNCATEGORIZED_LANGUAGE) ?? sorted[0];
  return top && top.percent > 0 ? formatLanguage(top.name, top.percent) : null;
}

/** Sums language time across daily summaries into overall shares. */
function languageShares(
  days: NonNullable<SummariesResponse["data"]>,
): Array<{ name: string; percent: number }> {
  const totals = new Map<string, number>();
  for (const day of days) {
    for (const lang of day.languages ?? []) {
      totals.set(lang.name, (totals.get(lang.name) ?? 0) + lang.total_seconds);
    }
  }

  const sum = [...totals.values()].reduce((acc, s) => acc + s, 0);
  if (sum === 0) return [];
  return [...totals].map(([name, s]) => ({ name, percent: (s / sum) * 100 }));
}

/** Today's calendar date (YYYY-MM-DD) in `timeZone`, falling back to UTC. */
function todayIn(timeZone: string | undefined): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function shiftDate(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/**
 * Fetches JSON from WakaTime. Next only caches 200 responses, so a 202
 * ("still calculating") is refetched on the next request instead of sticking.
 */
async function fetchJson<T>(
  url: string,
  authHeader: string,
  revalidate: number = REVALIDATE.MEDIUM,
): Promise<T | null> {
  const res = await fetch(url, {
    headers: { Authorization: authHeader },
    next: { revalidate },
  });
  return res.ok ? ((await res.json()) as T) : null;
}

async function getAllTimeStats(authHeader: string): Promise<WakaTimeStats> {
  const [allTime, stats] = await Promise.all([
    fetchJson<AllTimeResponse>(
      `${WAKATIME_API}/all_time_since_today`,
      authHeader,
    ),
    fetchJson<AllTimeStatsResponse>(
      `${WAKATIME_API}/stats/all_time`,
      authHeader,
    ),
  ]);

  const pending = [allTime?.data, stats?.data].filter(
    (d): d is Freshness => d?.is_up_to_date === false,
  );
  if (pending.length > 0) {
    return {
      ...EMPTY_STATS,
      calculatingPercent: Math.min(
        ...pending.map((d) => d.percent_calculated ?? 0),
      ),
    };
  }

  return {
    codingTime: allTime?.data?.text ?? null,
    dailyAverage: stats?.data?.human_readable_daily_average ?? null,
    topLanguage: pickTopLanguage(stats?.data?.languages ?? []),
    calculatingPercent: null,
  };
}

async function getRangedStats(
  days: number,
  authHeader: string,
): Promise<WakaTimeStats> {
  const user = await fetchJson<UserResponse>(
    WAKATIME_API,
    authHeader,
    REVALIDATE.LONG,
  );
  const end = todayIn(user?.data?.timezone);
  const params = new URLSearchParams({
    start: shiftDate(end, -(days - 1)),
    end,
  });

  const summaries = await fetchJson<SummariesResponse>(
    `${WAKATIME_API}/summaries?${params}`,
    authHeader,
  );

  return {
    codingTime: summaries?.cumulative_total?.text ?? null,
    dailyAverage: summaries?.daily_average?.text ?? null,
    topLanguage: pickTopLanguage(languageShares(summaries?.data ?? [])),
    calculatingPercent: null,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetches coding activity stats from the WakaTime API for the given range. */
async function getStats(range: StatsRange = "all"): Promise<WakaTimeStats> {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) return EMPTY_STATS;

  const authHeader = `Basic ${Buffer.from(apiKey).toString("base64")}`;
  const days = rangeToDays(range);

  try {
    return days === null
      ? await getAllTimeStats(authHeader)
      : await getRangedStats(days, authHeader);
  } catch {
    return EMPTY_STATS;
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const WakaTimeService = {
  getStats,
} as const;
