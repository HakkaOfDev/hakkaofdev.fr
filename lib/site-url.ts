import { SITE } from "./constants";

function stripTrailingSlashes(url: string) {
  return url.replace(/\/+$/, "");
}

/**
 * Canonical site URL (no trailing slash) used for SEO routes like sitemap/robots.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL – explicit override for custom domains / forks
 *  2. VERCEL_URL – auto-set by Vercel on every deployment
 *  3. SITE.url – production default so SEO metadata never references localhost
 */
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlashes(explicit);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const withProtocol = vercel.startsWith("http")
      ? vercel
      : `https://${vercel}`;
    return stripTrailingSlashes(withProtocol);
  }

  return SITE.url;
}
