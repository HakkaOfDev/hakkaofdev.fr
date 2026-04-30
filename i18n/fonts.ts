import {
  Noto_Sans_Arabic,
  Noto_Sans_Devanagari,
  Noto_Sans_Hebrew,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_SC,
} from "next/font/google";
import type { Locale } from "./routing";

/**
 * Script-specific Noto fallbacks. The user's chosen terminal font
 * (JetBrains Mono) covers Latin, Cyrillic, Greek and Latin Extended, so no
 * extra font is needed for ru/uk/pl/cs/nl/ro/el/tr/vi/id and the original
 * Western set.
 *
 * For the rest we lazy-load a Noto family — `preload: false` keeps every
 * other route free of an upfront download. The variable only ends up in the
 * font-face cache when it's actually used, so the `en` route never pays
 * the cost of these fonts.
 *
 * Each call must use a literal options object — Next.js statically inspects
 * the call to determine which subsets/weights to fetch, so spreads aren't
 * allowed here.
 */

export const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "600"],
});

export const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "600"],
});

export const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "600"],
});

export const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-deva",
  subsets: ["devanagari", "latin"],
  display: "swap",
  preload: false,
  weight: ["400", "600"],
});

export const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-ar",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: false,
  weight: ["400", "600"],
});

export const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-noto-he",
  subsets: ["hebrew", "latin"],
  display: "swap",
  preload: false,
  weight: ["400", "600"],
});

export function getScriptFontVariable(locale: Locale): string {
  switch (locale) {
    case "zh":
      return notoSansSC.variable;
    case "ja":
      return notoSansJP.variable;
    case "ko":
      return notoSansKR.variable;
    case "hi":
      return notoSansDevanagari.variable;
    case "ar":
      return notoSansArabic.variable;
    case "he":
      return notoSansHebrew.variable;
    default:
      return "";
  }
}
