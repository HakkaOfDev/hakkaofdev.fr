/** Returns the length of a string in Unicode code points (grapheme-aware). */
export function codepointLength(str: string): number {
  return [...str].length;
}

/** Cleans and truncates text input to a maximum length. */
export function cleanText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  const cleaned = input.trim().replace(/\s+/g, " ");
  return [...cleaned].slice(0, maxLength).join("");
}
