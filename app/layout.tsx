import { CommandsProvider } from "@/components/CommandsProvider";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";
import { SITE, SOCIALS } from "@/lib/constants";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "optional",
  adjustFontFallback: true,
});

const siteUrl = getSiteUrl();
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: siteUrl,
  image: new URL("/avatar.jpeg", siteUrl).toString(),
  jobTitle: SITE.jobTitle,
  worksFor: {
    "@type": "Organization",
    name: SITE.employer.name,
    url: SITE.employer.url,
  },
  sameAs: SOCIALS.map((social) => social.url),
};

const twitterHandle = `@${SITE.handle}` as const;
const githubUrl = SOCIALS.find((s) => s.name === "GitHub")!.url;

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
      url: githubUrl,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          montserrat.variable,
          "font-montserrat flex flex-col h-[100dvh] overflow-hidden antialiased",
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <CommandsProvider>
            {children}
            <Footer />
          </CommandsProvider>
        </Providers>
        {process.env.VERCEL && <Analytics />}
        {process.env.VERCEL && <SpeedInsights />}
      </body>
    </html>
  );
}
