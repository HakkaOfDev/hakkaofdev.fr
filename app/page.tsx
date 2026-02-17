import Image from "next/image";
import MainScreen from "@/components/MainScreen";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden container max-w-2xl items-center justify-center gap-8 pt-8 mx-auto px-4">
      <Image
        src="/logo.png"
        alt="Alexandre Gossard Logo"
        quality={75}
        width={50}
        height={50}
        sizes="50px"
        className="rounded-full border-2 border-primary"
        priority
      />
      <MainScreen />
    </main>
  );
}
