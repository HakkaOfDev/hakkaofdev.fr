import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    // Original 8
    "en",
    "fr",
    "es",
    "de",
    "pt",
    "it",
    "zh",
    "ja",
    // Slavic
    "ru",
    "uk",
    "pl",
    "cs",
    // Other European LTR
    "nl",
    "ro",
    "el",
    "tr",
    // Asian / Indic LTR
    "ko",
    "hi",
    "vi",
    "id",
    // Right-to-left
    "ar",
    "he",
  ],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

const RTL_LOCALES = new Set<Locale>(["ar", "he"]);

export function isRtlLocale(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}
