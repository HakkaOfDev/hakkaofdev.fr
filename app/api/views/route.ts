import {
  extractCountry,
  extractIpAddress,
  hashIpAddress,
} from "@/lib/services/guestbook";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  if (!supabase) return Response.json({ views: null }, { status: 503 });

  const { data } = await supabase
    .from("page_views")
    .select("count")
    .eq("slug", "/")
    .single();

  return Response.json({ views: data?.count ?? 0 });
}

export async function POST(request: Request) {
  if (!supabase) {
    return Response.json({ error: "Analytics unavailable." }, { status: 503 });
  }

  const ipHash = hashIpAddress(extractIpAddress(request)) ?? "unknown";
  const country = extractCountry(request);
  const userAgent = request.headers.get("user-agent")?.slice(0, 255) ?? null;

  const { data, error } = await supabase.rpc("record_visit", {
    p_slug: "/",
    p_ip_hash: ipHash,
    p_country: country,
    p_user_agent: userAgent,
  });

  if (error) {
    return Response.json({ error: "Failed to record visit." }, { status: 500 });
  }

  return Response.json({ ok: true, is_new: data?.is_new ?? false });
}
