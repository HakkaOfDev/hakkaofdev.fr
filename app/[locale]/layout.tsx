import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import Providers from "@/components/providers/Providers";
import { routing } from "@/i18n/routing";
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

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  creator: SITE.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: siteUrl,
    type: "website",
    siteName: SITE.title,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/opengraph-image"],
    site: twitterHandle,
    creator: twitterHandle,
  },
  keywords: [...SITE.keywords],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: siteUrl,
    image: new URL("/avatar.jpg", siteUrl).toString(),
    jobTitle: SITE.jobTitle,
    worksFor: {
      "@type": "Organization",
      name: SITE.employer.name,
      url: SITE.employer.url,
    },
    sameAs: SOCIALS.map((social) => social.url),
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          jetbrainsMono.variable,
          "flex h-[100dvh] flex-col overflow-hidden antialiased",
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
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
