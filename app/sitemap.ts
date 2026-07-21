import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const buildLocaleUrl = (locale: string) =>
    locale === routing.defaultLocale
      ? siteUrl
      : new URL(`/${locale}`, siteUrl).toString();

  const languages: Record<string, string> = {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, buildLocaleUrl(locale)]),
    ),
    "x-default": buildLocaleUrl(routing.defaultLocale),
  };

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages,
      },
    },
  ];
}
