import { CommandsProvider } from "@/components/CommandsProvider";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alexandre Gossard",
  description: "Alexandre Gossard's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} flex flex-col h-screen antialiased`}
      >
        <ThemeProvider>
          <CommandsProvider>
            {children}
            <Footer />
          </CommandsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
