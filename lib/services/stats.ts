import type { StatsRange } from "@/types/analytics";
import type { StatsData } from "@/types/stats";
import { AnalyticsService } from "./analytics";
import { GitHubService } from "./github";
import { WakaTimeService } from "./wakatime";

/** Aggregates stats from WakaTime, GitHub, and Supabase in parallel. */
async function getStats(range: StatsRange = "all"): Promise<StatsData> {
  const [wakatime, totalStars, contributions, codingSince, uniqueVisitors] =
    await Promise.all([
      WakaTimeService.getStats(),
      GitHubService.getTotalStars(),
      GitHubService.getContributions(),
      GitHubService.getCodingSince(),
      AnalyticsService.getUniqueVisitors(range),
    ]);

  const visitors = uniqueVisitors !== null ? uniqueVisitors.total : null;

  return { wakatime, totalStars, contributions, codingSince, visitors };
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const StatsService = {
  getStats,
} as const;
