/**
 * ISO 3166-1 alpha-2 → emoji flag using regional indicator symbols.
 * Returns a placeholder for unknown / invalid codes.
 */
export function countryCodeToFlag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "🏳";

  const upper = code.toUpperCase();
  const a = upper.charCodeAt(0);
  const b = upper.charCodeAt(1);

  const isLetter = (c: number) => c >= 65 && c <= 90;
  if (!isLetter(a) || !isLetter(b)) return "🏳";

  return String.fromCodePoint(0x1f1e6 + a - 65, 0x1f1e6 + b - 65);
}

/**
 * Localized region name from ISO 3166-1 alpha-2. Falls back to the raw code
 * when the runtime can't resolve it.
 */
export function countryName(
  code: string | null | undefined,
  locale: string,
): string {
  if (!code) return "";
  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return dn.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}
