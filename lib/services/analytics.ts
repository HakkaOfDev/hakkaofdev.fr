import {
  HOME_SLUG,
  VISITOR_COUNTRIES_LIMIT,
} from "@/lib/constants/analytics.constants";
import type { UniqueVisitorsResult, VisitorCountry } from "@/types/analytics";

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetches total page views for the home page from Supabase. */
async function getPageViews(): Promise<number | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data } = await supabase
      .from("page_views")
      .select("count")
      .eq("slug", HOME_SLUG)
      .single();

    return data?.count ?? 0;
  } catch {
    return null;
  }
}

/** Fetches unique visitor counts (total / last 30 days / today) for the home page. */
async function getUniqueVisitors(): Promise<UniqueVisitorsResult | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data } = await supabase
      .from("unique_visitors")
      .select("total, last_30d, today")
      .eq("slug", HOME_SLUG)
      .single();

    return data ?? { total: 0, last_30d: 0, today: 0 };
  } catch {
    return null;
  }
}

/** Fetches per-country visitor breakdown for the home page. */
async function getVisitorCountries(): Promise<VisitorCountry[] | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data } = await supabase
      .from("visitor_countries")
      .select("country, unique_count, total_hits")
      .eq("slug", HOME_SLUG)
      .order("unique_count", { ascending: false })
      .limit(VISITOR_COUNTRIES_LIMIT);

    return data ?? [];
  } catch {
    return null;
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const AnalyticsService = {
  getPageViews,
  getUniqueVisitors,
  getVisitorCountries,
} as const;
