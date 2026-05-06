import { HOME_SLUG } from "@/lib/constants/analytics.constants";
import { supabase } from "@/lib/supabase";
import {
  extractCountry,
  extractIpAddress,
  hashIpAddress,
  isBotUserAgent,
} from "@/lib/utils/request.utils";

export const runtime = "nodejs";

export async function GET() {
  if (!supabase) return Response.json({ visitors: null }, { status: 503 });

  const { data } = await supabase
    .from("unique_visitors")
    .select("total")
    .eq("slug", HOME_SLUG)
    .single();

  return Response.json({ visitors: data?.total ?? 0 });
}

export async function POST(request: Request) {
  if (!supabase) {
    return Response.json({ error: "Analytics unavailable." }, { status: 503 });
  }

  const userAgent = request.headers.get("user-agent")?.slice(0, 255) ?? null;

  if (isBotUserAgent(userAgent)) {
    return Response.json({ ok: true, is_new: false });
  }

  const ipHash = hashIpAddress(extractIpAddress(request)) ?? "unknown";
  const country = extractCountry(request);

  const { data, error } = await supabase.rpc("record_visit", {
    p_slug: HOME_SLUG,
    p_ip_hash: ipHash,
    p_country: country,
    p_user_agent: userAgent,
  });

  if (error) {
    return Response.json({ error: "Failed to record visit." }, { status: 500 });
  }

  return Response.json({ ok: true, is_new: data?.is_new ?? false });
}
