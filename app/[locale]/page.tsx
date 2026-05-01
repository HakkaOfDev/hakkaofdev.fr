import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import MainScreen from "@/components/MainScreen";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-4 py-6">
      <Image
        src="/logo.png"
        alt="Alexandre Gossard Logo"
        quality={75}
        width={44}
        height={44}
        sizes="44px"
        className="rounded-full shadow-sm ring-1 ring-border/40 dark:ring-overlay-medium"
        priority
      />
      <MainScreen />
    </main>
  );
}
