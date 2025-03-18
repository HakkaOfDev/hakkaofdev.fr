import { CommandsProvider } from "@/components/CommandsProvider";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alexandre Gossard",
  description:
    "Lead Frontend Developer @kabila.app, open-source enthusiast and passionate about modern technologies.",
  creator: "Alexandre Gossard",
  openGraph: {
    title: "Alexandre Gossard",
    description:
      "Lead Frontend Developer @kabila.app, open-source enthusiast and passionate about modern technologies.",
    images: [
      {
        url: "/avatar.jpeg",
        width: 500,
        height: 500,
        alt: "Alexandre Gossard",
      },
    ],
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
  metadataBase: new URL("https://hakkaofdev.fr"),
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
      </body>
    </html>
  );
}
