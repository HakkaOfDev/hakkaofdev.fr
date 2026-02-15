"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import TerminalInput from "./TerminalInput";
import { ModeToggle } from "./ModeToggle";

const SpotifyPlayer = dynamic(() => import("./SpotifyPlayer"), {
  ssr: false,
});

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
}

export const Terminal = ({ children, className }: TerminalProps) => {
  return (
    <div
      className={cn(
        "z-0 h-full flex flex-col max-h-full overflow-hidden md:h-[500px] md:max-h-[500px] w-full rounded-xl border border-border bg-background",
        className,
      )}
    >
      <div className="flex relative border-b border-border p-4">
        <div className="flex flex-row gap-x-2">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <SpotifyPlayer />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <ModeToggle />
        </div>
      </div>
      <pre className="px-4 pt-4 gap-4 divide-y flex-1 overflow-auto flex flex-col-reverse [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground">
        <code className="grid divide-y gap-4">{children}</code>
      </pre>
      <div className="p-4">
        <TerminalInput />
      </div>
    </div>
  );
};
