import { createHash } from "node:crypto";

/** Extracts the client IP from request headers (x-forwarded-for, x-real-ip). */
export function extractIpAddress(request: Request): string | null {
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || null;
}

/** Hashes an IP address with salt for privacy-preserving storage. */
export function hashIpAddress(ip: string | null): string | null {
  if (!ip) return null;

  const salt = process.env.APP_IP_SALT?.trim() ?? "";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

/** Extracts the client country from Vercel/Cloudflare headers. */
export function extractCountry(request: Request): string | null {
  return (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    null
  );
}

/** Lowercase host without a leading `www.`, so apex and www compare equal. */
export function bareHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

/**
 * Returns the lowercase host of the Referer header, dropping self-referrals
 * (same site as the current request, apex or www). Returns null for direct
 * visits or unparseable referrers. Useful for analytics breakdowns.
 */
export function extractReferrer(request: Request): string | null {
  const raw = request.headers.get("referer") ?? request.headers.get("referrer");
  if (!raw) return null;

  const refHost = parseReferrerHost(raw);
  if (!refHost) return raw.slice(0, 255).toLowerCase();

  const currentHost = request.headers.get("host");
  if (currentHost && bareHost(refHost) === bareHost(currentHost)) return null;
  return refHost.slice(0, 255);
}

/**
 * Host of a Referer value. Scanners often send a bare host
 * ("example.com", "example.com:443"), so retry with a scheme to still get a
 * normalized host (default port dropped) that self-referral checks can match.
 */
function parseReferrerHost(raw: string): string | null {
  for (const candidate of [raw, `https://${raw}`]) {
    try {
      const host = new URL(candidate).host.toLowerCase();
      if (host) return host;
    } catch {}
  }
  return null;
}

const BOT_USER_AGENT_PATTERN =
  /bot|crawl(?:er|ing)?|spider|slurp|mediapartners|facebookexternalhit|whatsapp|telegram|discord|slack|linkedin|twitter|pinterest|embedly|preview|fetch|monitor|pingdom|gtmetrix|lighthouse|pagespeed|chrome-lighthouse|headless|phantomjs|puppeteer|playwright|selenium|axios|curl|wget|python-requests|node-fetch|go-http-client|java\/|okhttp/i;

/** Returns true when the User-Agent looks like a bot, crawler, or automated client. */
export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  return BOT_USER_AGENT_PATTERN.test(userAgent);
}
