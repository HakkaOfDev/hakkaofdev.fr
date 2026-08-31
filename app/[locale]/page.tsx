import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import MainScreen from "@/components/MainScreen";
import { WindowStage } from "@/components/WindowStage";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <WindowStage>
      <Image
        src="/logo.png"
        alt="Alexandre Gossard Logo"
        width={44}
        height={44}
        sizes="88px"
        className="rounded-full bg-background/70 shadow-sm ring-1 ring-border backdrop-blur-xs dark:ring-overlay-medium"
        priority
      />
      <MainScreen />
    </WindowStage>
  );
}
