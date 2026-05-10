import { HOME_SLUG } from "@/lib/constants/analytics.constants";
import { supabase } from "@/lib/supabase";
import {
  extractCountry,
  extractIpAddress,
  extractReferrer,
  hashIpAddress,
  isBotUserAgent,
} from "@/lib/utils/request.utils";

export const runtime = "nodejs";

export async function GET() {
  if (!supabase) return Response.json({ visitors: null }, { status: 503 });

  const { data } = await supabase.rpc("get_unique_visitors_site_range", {
    p_days: null,
  });
  const row = Array.isArray(data) ? data[0] : data;

  return Response.json({ visitors: row?.total ?? 0 });
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
  const referrer = extractReferrer(request);

  const { data, error } = await supabase.rpc("record_visit", {
    p_slug: HOME_SLUG,
    p_ip_hash: ipHash,
    p_country: country,
    p_user_agent: userAgent,
    p_referrer: referrer,
  });

  if (error) {
    return Response.json({ error: "Failed to record visit." }, { status: 500 });
  }

  return Response.json({ ok: true, is_new: data?.is_new ?? false });
}
