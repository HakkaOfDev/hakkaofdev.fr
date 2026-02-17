import type { WakaTimeStats } from "@/lib/types/stats";

// ─── Constants ───────────────────────────────────────────────────────────────

const WAKATIME_API = "https://wakatime.com/api/v1/users/current";

const EMPTY_STATS: WakaTimeStats = {
  codingTime: null,
  dailyAverage: null,
  topLanguage: null,
};

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetches coding activity stats from the WakaTime API. */
export async function getWakaTimeStats(): Promise<WakaTimeStats> {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) return EMPTY_STATS;

  const authHeader = `Basic ${Buffer.from(apiKey).toString("base64")}`;

  try {
    const [allTimeRes, statsRes] = await Promise.all([
      fetch(`${WAKATIME_API}/all_time_since_today`, {
        headers: { Authorization: authHeader },
        next: { revalidate: 3600 },
      }),
      fetch(`${WAKATIME_API}/stats/last_7_days`, {
        headers: { Authorization: authHeader },
        next: { revalidate: 3600 },
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
