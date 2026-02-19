/** Parses a string as a positive integer, returning fallback if invalid. */
export function parsePositiveInt(
  value: string | null,
  fallback: number,
): number {
  if (!value) return fallback;
  const num = Number.parseInt(value, 10);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return num;
}
