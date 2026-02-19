/** Normalizes a website input to a valid https URL, or returns null if invalid. */
export function normalizeWebsite(input: string): string | null {
  if (!input) return null;

  const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}
