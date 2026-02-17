import Image from "next/image";
import MainScreen from "@/components/MainScreen";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden container max-w-2xl items-center justify-center gap-6 py-6 mx-auto px-4">
      <Image
        src="/logo.png"
        alt="Alexandre Gossard Logo"
        quality={75}
        width={44}
        height={44}
        sizes="44px"
        className="rounded-full ring-1 ring-border/40 dark:ring-white/10 shadow-sm"
        priority
      />
      <MainScreen />
    </main>
  );
}
