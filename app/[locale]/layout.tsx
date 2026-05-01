import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { useId } from "react";
import Footer from "@/components/Footer";
import Providers from "@/components/providers/Providers";
import { getScriptFontVariable } from "@/i18n/fonts";
import { getDirection, type Locale, routing } from "@/i18n/routing";
import { GITHUB_URL, SITE, SOCIALS } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";
import "../globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "optional",
  adjustFontFallback: true,
});

const siteUrl = getSiteUrl();
const twitterHandle = `@${SITE.handle}` as const;

type Params = { locale: string };

function PersonJsonLd({ data }: { data: object }) {
  const id = useId();
  return (
    <Script id={id} type="application/ld+json" strategy="beforeInteractive">
      {JSON.stringify(data).replace(/</g, "\\u003c")}
    </Script>
  );
}

function buildOpenGraphImagePath(locale: string) {
  return locale === routing.defaultLocale
    ? "/opengraph-image"
    : `/${locale}/opengraph-image`;
}

function buildCanonicalPath(locale: string) {
  return locale === routing.defaultLocale ? "/" : `/${locale}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const title = t("title");
  const description = t("description");
  const keywords = t.raw("keywords") as string[];
  const ogImageAlt = t("ogImageAlt");
  const canonicalPath = buildCanonicalPath(locale);
  const ogImagePath = buildOpenGraphImagePath(locale);

  const languageAlternates = Object.fromEntries(
    routing.locales.map((l) => [l, buildCanonicalPath(l)]),
  );

  return {
    title,
    description,
    creator: SITE.name,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: new URL(canonicalPath, siteUrl).toString(),
      type: "website",
      siteName: title,
      locale,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImagePath],
      site: twitterHandle,
      creator: twitterHandle,
    },
    keywords,
    authors: [
      {
        name: SITE.name,
        url: GITHUB_URL,
      },
    ],
    metadataBase: new URL(siteUrl),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<Params>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, t] = await Promise.all([
    getMessages(),
    getTranslations({ locale, namespace: "Metadata" }),
  ]);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: siteUrl,
    image: new URL("/avatar.jpg", siteUrl).toString(),
    jobTitle: t("jobTitle"),
    description: t("description"),
    worksFor: {
      "@type": "Organization",
      name: SITE.employer.name,
      url: SITE.employer.url,
    },
    sameAs: SOCIALS.map((social) => social.url),
  };

  const narrowedLocale = locale as Locale;
  const scriptFontVariable = getScriptFontVariable(narrowedLocale);
  const direction = getDirection(narrowedLocale);

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className={cn(
          jetbrainsMono.variable,
          scriptFontVariable,
          "flex h-[100dvh] flex-col overflow-hidden antialiased",
        )}
      >
        <PersonJsonLd data={personJsonLd} />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
        {process.env.VERCEL && <Analytics />}
        {process.env.VERCEL && <SpeedInsights />}
      </body>
    </html>
  );
}
