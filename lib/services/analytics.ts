import {
  HOME_SLUG,
  VISITOR_COUNTRIES_LIMIT,
} from "@/lib/constants/analytics.constants";
import type {
  StatsRange,
  TopPage,
  UniqueVisitorsResult,
  VisitorBrowser,
  VisitorCountry,
  VisitorReferrer,
  VisitorTrendPoint,
} from "@/types/analytics";
import { rangeToDays } from "@/types/analytics";

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

/**
 * Site-wide unique visitor counts (across all slugs), optionally bounded by a
 * time range. Backwards-compatible with the old per-slug `unique_visitors` view
 * call site — returns `{ total, last_30d, today }`.
 */
async function getUniqueVisitors(
  range: StatsRange = "all",
): Promise<UniqueVisitorsResult | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data, error } = await supabase.rpc(
      "get_unique_visitors_site_range",
      { p_days: rangeToDays(range) },
    );

    if (error) return null;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return { total: 0, last_30d: 0, today: 0 };

    return {
      total: Number(row.total ?? 0),
      last_30d: Number(row.last_30d ?? 0),
      today: Number(row.today_count ?? 0),
    };
  } catch {
    return null;
  }
}

/** Per-country breakdown for a given time range (defaults to all time). */
async function getVisitorCountries(
  range: StatsRange = "all",
  limit: number = VISITOR_COUNTRIES_LIMIT,
): Promise<VisitorCountry[] | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data, error } = await supabase.rpc("get_visitor_countries_range", {
      p_slug: null,
      p_days: rangeToDays(range),
      p_limit: limit,
    });

    if (error) return null;
    return (data as VisitorCountry[] | null) ?? [];
  } catch {
    return null;
  }
}

/** Top pages site-wide, ranked by unique visitors. */
async function getTopPages(
  range: StatsRange = "all",
  limit: number = 20,
): Promise<TopPage[] | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data, error } = await supabase.rpc("get_top_pages_range", {
      p_days: rangeToDays(range),
      p_limit: limit,
    });

    if (error) return null;
    return (data as TopPage[] | null) ?? [];
  } catch {
    return null;
  }
}

/** Browser breakdown (Chrome / Safari / Firefox / Edge / Opera / Other). */
async function getBrowserBreakdown(
  range: StatsRange = "all",
  limit: number = 10,
): Promise<VisitorBrowser[] | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data, error } = await supabase.rpc("get_visitor_browsers_range", {
      p_slug: null,
      p_days: rangeToDays(range),
      p_limit: limit,
    });

    if (error) return null;
    return (data as VisitorBrowser[] | null) ?? [];
  } catch {
    return null;
  }
}

/** Top referrer hosts (excluding self-referrals). */
async function getReferrerBreakdown(
  range: StatsRange = "all",
  limit: number = 20,
): Promise<VisitorReferrer[] | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data, error } = await supabase.rpc("get_visitor_referrers_range", {
      p_slug: null,
      p_days: rangeToDays(range),
      p_limit: limit,
    });

    if (error) return null;
    return (data as VisitorReferrer[] | null) ?? [];
  } catch {
    return null;
  }
}

/** Daily visit timeseries with zero-filled gaps. */
async function getVisitorTrend(
  range: StatsRange = "30d",
): Promise<VisitorTrendPoint[] | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const days = rangeToDays(range) ?? 30;
    const { data, error } = await supabase.rpc("get_visitor_trend", {
      p_slug: null,
      p_days: days,
    });

    if (error) return null;
    const rows =
      (data as Array<{
        bucket: string;
        unique_count: number;
        total_hits: number;
      }> | null) ?? [];

    return rows.map((row) => ({
      bucket: row.bucket,
      unique_count: Number(row.unique_count ?? 0),
      total_hits: Number(row.total_hits ?? 0),
    }));
  } catch {
    return null;
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const AnalyticsService = {
  getPageViews,
  getUniqueVisitors,
  getVisitorCountries,
  getTopPages,
  getBrowserBreakdown,
  getReferrerBreakdown,
  getVisitorTrend,
} as const;
