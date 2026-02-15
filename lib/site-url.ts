function stripTrailingSlashes(url: string) {
  return url.replace(/\/+$/, "");
}

/**
 * Canonical site URL (no trailing slash) used for SEO routes like sitemap/robots.
 *
 * Prefer explicit config via NEXT_PUBLIC_SITE_URL for production and forks.
 * Falls back to Vercel's deployment URL, then localhost for local dev.
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

  return "http://localhost:3000";
}

