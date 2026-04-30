import { Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import type { Locale } from "./routing";

/**
 * CJK font fallbacks. Latin glyphs render with the user's chosen terminal
 * font (JetBrains Mono by default); browsers fall through to these for
 * Chinese / Japanese characters. Loaded lazily — `preload: false` keeps the
 * en/fr/es/etc. routes free of an upfront font download.
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

export function getCjkFontVariable(locale: Locale) {
  if (locale === "zh") return notoSansSC.variable;
  if (locale === "ja") return notoSansJP.variable;
  return "";
}
