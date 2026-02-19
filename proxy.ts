import { createClient } from "@supabase/supabase-js";
import { after, type NextRequest, NextResponse } from "next/server";
import { HOME_SLUG } from "@/lib/constants/analytics.constants";
import {
  extractCountry,
  extractIpAddress,
  hashIpAddress,
} from "@/lib/utils/request.utils";

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const ipAddress = extractIpAddress(request);
    const ipHash = hashIpAddress(ipAddress);
    const country = extractCountry(request);
    const userAgent = request.headers.get("user-agent")?.slice(0, 255) ?? null;

    after(async () => {
      if (!ipHash) return;

      const supabase = createClient(url, key);
      try {
        await supabase.rpc("record_visit", {
          p_slug: HOME_SLUG,
          p_ip_hash: ipHash,
          p_country: country,
          p_user_agent: userAgent,
        });
      } catch {}
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
