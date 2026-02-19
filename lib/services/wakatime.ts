import { REVALIDATE, WAKATIME_API } from "@/lib/constants/api.constants";
import type { WakaTimeStats } from "@/types/stats";

// ─── Constants ───────────────────────────────────────────────────────────────

const EMPTY_STATS: WakaTimeStats = {
  codingTime: null,
  dailyAverage: null,
  topLanguage: null,
};

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetches coding activity stats from the WakaTime API. */
async function getStats(): Promise<WakaTimeStats> {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) return EMPTY_STATS;

  const authHeader = `Basic ${Buffer.from(apiKey).toString("base64")}`;

  try {
    const [allTimeRes, statsRes] = await Promise.all([
      fetch(`${WAKATIME_API}/all_time_since_today`, {
        headers: { Authorization: authHeader },
        next: { revalidate: REVALIDATE.MEDIUM },
      }),
      fetch(`${WAKATIME_API}/stats/last_7_days`, {
        headers: { Authorization: authHeader },
        next: { revalidate: REVALIDATE.MEDIUM },
      }),
    ]);

    const allTime = allTimeRes.ok
      ? ((await allTimeRes.json()) as {
          data?: { text?: string };
        })
      : null;

    const stats = statsRes.ok
      ? ((await statsRes.json()) as {
          data?: {
            human_readable_daily_average?: string;
            languages?: Array<{ name: string; percent: number }>;
          };
        })
      : null;

    const topLang = stats?.data?.languages?.[0];

    return {
      codingTime: allTime?.data?.text ?? null,
      dailyAverage: stats?.data?.human_readable_daily_average ?? null,
      topLanguage: topLang
        ? `${topLang.name} (${topLang.percent.toFixed(0)}%)`
        : null,
    };
  } catch {
    return EMPTY_STATS;
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const WakaTimeService = {
  getStats,
} as const;
