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

/**
 * Returns the lowercase host of the Referer header, dropping self-referrals
 * (same host as the current request). Returns null for direct visits or
 * unparseable referrers. Useful for analytics breakdowns.
 */
export function extractReferrer(request: Request): string | null {
  const raw = request.headers.get("referer") ?? request.headers.get("referrer");
  if (!raw) return null;

  try {
    const refUrl = new URL(raw);
    const currentHost = request.headers.get("host")?.toLowerCase();
    const refHost = refUrl.host.toLowerCase();

    if (currentHost && refHost === currentHost.toLowerCase()) return null;
    return refHost.slice(0, 255) || null;
  } catch {
    return raw.slice(0, 255).toLowerCase();
  }
}

const BOT_USER_AGENT_PATTERN =
  /bot|crawl(?:er|ing)?|spider|slurp|mediapartners|facebookexternalhit|whatsapp|telegram|discord|slack|linkedin|twitter|pinterest|embedly|preview|fetch|monitor|pingdom|gtmetrix|lighthouse|pagespeed|chrome-lighthouse|headless|phantomjs|puppeteer|playwright|selenium|axios|curl|wget|python-requests|node-fetch|go-http-client|java\/|okhttp/i;

/** Returns true when the User-Agent looks like a bot, crawler, or automated client. */
export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  return BOT_USER_AGENT_PATTERN.test(userAgent);
}
