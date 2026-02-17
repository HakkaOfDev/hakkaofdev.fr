import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return Response.json({ views: null }, { status: 503 });

  const { data } = await supabase
    .from("page_views")
    .select("count")
    .eq("slug", "/")
    .single();

  return Response.json({ views: data?.count ?? 0 });
}
