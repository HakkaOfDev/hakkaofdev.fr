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
  name: "Alexandre Gossard",
  url: siteUrl,
  image: new URL("/avatar.jpeg", siteUrl).toString(),
  jobTitle: "Lead Frontend Developer",
  worksFor: {
    "@type": "Organization",
    name: "kabila.app",
    url: "https://kabila.app",
  },
  sameAs: [
    "https://github.com/hakkaofdev",
    "https://www.linkedin.com/in/hakkaofdev/",
    "https://www.instagram.com/hakkaofdev/",
    "https://x.com/hakkaofdev",
  ],
};

export const metadata: Metadata = {
  title: "Alexandre Gossard",
  description:
    "Digital nomad & Software Engineer @kabila.app. Open-source enthusiast crafting performant web experiences with React and Next.js.",
  creator: "Alexandre Gossard",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Alexandre Gossard",
    description:
      "Digital nomad & Software Engineer @kabila.app. Open-source enthusiast crafting performant web experiences with React and Next.js.",
    url: siteUrl,
    type: "website",
    siteName: "Alexandre Gossard",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Alexandre Gossard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexandre Gossard",
    description:
      "Digital nomad & Software Engineer @kabila.app. Open-source enthusiast crafting performant web experiences with React and Next.js.",
    images: ["/twitter-image"],
    site: "@hakkaofdev",
    creator: "@hakkaofdev",
  },
  keywords: [
    "Alexandre Gossard",
    "Frontend Developer",
    "Digital Nomad",
    "Open-source",
    "Modern Technologies",
    "hakkaofdev",
    "kabila.app",
    "Software Engineer",
    "Freelance",
  ],
  authors: [
    {
      name: "Alexandre Gossard",
      url: "https://github.com/hakkaofdev",
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
          // JSON-LD is not a React component; this is the recommended approach in Next.js.
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
