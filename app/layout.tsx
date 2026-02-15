import { CommandsProvider } from "@/components/CommandsProvider";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Alexandre Gossard",
  description:
    "Lead Frontend Developer @kabila.app, open-source enthusiast and passionate about modern technologies.",
  creator: "Alexandre Gossard",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Alexandre Gossard",
    description:
      "Lead Frontend Developer @kabila.app, open-source enthusiast and passionate about modern technologies.",
    url: siteUrl,
    images: [
      {
        url: "/avatar.jpeg",
        width: 500,
        height: 500,
        alt: "Alexandre Gossard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexandre Gossard",
    description:
      "Lead Frontend Developer @kabila.app, open-source enthusiast and passionate about modern technologies.",
    images: ["/avatar.jpeg"],
    creator: "@hakkaofdev",
  },
  keywords: [
    "Alexandre Gossard",
    "Frontend Developer",
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
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} flex flex-col h-[100dvh] overflow-hidden antialiased`}
      >
        <Providers>
          <CommandsProvider>
            {children}
            <Footer />
          </CommandsProvider>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
