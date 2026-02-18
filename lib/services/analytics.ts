// ─── Types ───────────────────────────────────────────────────────────────────

export type VisitorCountry = {
  country: string;
  unique_count: number;
  total_hits: number;
};

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetches total page views for the home page from Supabase. */
export async function getPageViews(): Promise<number | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data } = await supabase
      .from("page_views")
      .select("count")
      .eq("slug", "/")
      .single();

    return data?.count ?? 0;
  } catch {
    return null;
  }
}

/** Fetches unique visitor counts (total / last 30 days / today) for the home page. */
export async function getUniqueVisitors(): Promise<{
  total: number;
  last_30d: number;
  today: number;
} | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data } = await supabase
      .from("unique_visitors")
      .select("total, last_30d, today")
      .eq("slug", "/")
      .single();

    return data ?? { total: 0, last_30d: 0, today: 0 };
  } catch {
    return null;
  }
}

/** Fetches per-country visitor breakdown for the home page. */
export async function getVisitorCountries(): Promise<VisitorCountry[] | null> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return null;

    const { data } = await supabase
      .from("visitor_countries")
      .select("country, unique_count, total_hits")
      .eq("slug", "/")
      .order("unique_count", { ascending: false })
      .limit(20);

    return data ?? [];
  } catch {
    return null;
  }
}
