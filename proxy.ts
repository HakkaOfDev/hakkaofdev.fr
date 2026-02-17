import { createClient } from "@supabase/supabase-js";
import { after, type NextRequest, NextResponse } from "next/server";

export function proxy(_request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    after(async () => {
      const supabase = createClient(url, key);
      try {
        await supabase.rpc("increment_page_views");
      } catch {}
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
