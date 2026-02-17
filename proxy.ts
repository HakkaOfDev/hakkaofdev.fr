import { createClient } from "@supabase/supabase-js";
import { after, type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      null;

    after(async () => {
      if (!ip) return;

      const supabase = createClient(url, key);
      try {
        await supabase.rpc("track_visitor", { visitor_ip: ip });
      } catch {}
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
