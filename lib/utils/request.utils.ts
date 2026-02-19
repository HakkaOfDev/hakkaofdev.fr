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
