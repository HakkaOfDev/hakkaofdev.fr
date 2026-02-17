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
