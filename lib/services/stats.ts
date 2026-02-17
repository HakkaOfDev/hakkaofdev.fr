import type { StatsData } from "@/lib/types/stats";
import { getPageViews } from "./analytics";
import { getCodingSince, getContributions, getTotalStars } from "./github";
import { getWakaTimeStats } from "./wakatime";

/** Aggregates stats from WakaTime, GitHub, and Supabase in parallel. */
export async function getStats(): Promise<StatsData> {
  const [wakatime, totalStars, contributions, codingSince, pageViews] =
    await Promise.all([
      getWakaTimeStats(),
      getTotalStars(),
      getContributions(),
      getCodingSince(),
      getPageViews(),
    ]);

  return { wakatime, totalStars, contributions, codingSince, pageViews };
}
