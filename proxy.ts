import { createClient } from "@supabase/supabase-js";
import { after, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import {
  extractCountry,
  extractIpAddress,
  extractReferrer,
  hashIpAddress,
  isBotUserAgent,
} from "@/lib/utils/request.utils";

const intlMiddleware = createMiddleware(routing);

/**
 * Strip the locale prefix and trailing slash from a pathname so all locales
 * map to the same slug (`/fr/about` → `/about`, `/en` → `/`).
 */
function normalizeSlug(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) {
      const stripped = pathname.slice(locale.length + 1);
      return stripped.replace(/\/+$/, "") || "/";
    }
  }
  return pathname.replace(/\/+$/, "") || "/";
}

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (url && key) {
      const ipAddress = extractIpAddress(request);
      const ipHash = hashIpAddress(ipAddress);
      const country = extractCountry(request);
      const userAgent =
        request.headers.get("user-agent")?.slice(0, 255) ?? null;
      const referrer = extractReferrer(request);
      const slug = normalizeSlug(request.nextUrl.pathname);

      after(async () => {
        if (!ipHash || isBotUserAgent(userAgent)) return;

        const supabase = createClient(url, key);
        try {
          await supabase.rpc("record_visit", {
            p_slug: slug,
            p_ip_hash: ipHash,
            p_country: country,
            p_user_agent: userAgent,
            p_referrer: referrer,
          });
        } catch {}
      });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
