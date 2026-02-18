"use client";

import { RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCommands } from "./CommandsProvider";
import { GitHubStarButton } from "./GitHubStarButton";
import { ModeToggle } from "./ModeToggle";
import TerminalInput from "./TerminalInput";
import { useTerminal } from "./TerminalProvider";
import { TrafficLights } from "./TrafficLights";

const SpotifyPlayer = dynamic(() => import("./SpotifyPlayer"), {
  ssr: false,
});

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
}

export const Terminal = ({ children, className }: TerminalProps) => {
  const { reset } = useCommands();
  const { isMinimized, isMaximized } = useTerminal();

  return (
    <div
      className={cn(
        "z-0 flex flex-col w-full h-full rounded-xl border border-border/60 bg-background terminal-shadow dark:border-white/[0.08] terminal-resize overflow-hidden",
        isMinimized
          ? "max-h-11"
          : isMaximized
            ? "max-h-[calc(100dvh-120px)]"
            : "max-h-[calc(100dvh-120px)] md:max-h-[450px]",
        className,
      )}
    >
      {/* ── Title Bar ── */}
      <div className="flex items-center border-b border-border/50 dark:border-white/[0.06] px-4 h-11 shrink-0 bg-muted/40 dark:bg-white/[0.03] select-none">
        {/* Left zone */}
        <div className="flex items-center flex-1 basis-0 min-w-0">
          <TrafficLights />
        </div>

        {/* Center zone — title */}
        <span className="text-[11px] text-muted-foreground/80 font-medium tracking-wide shrink-0">
          {SITE.handle} &mdash; zsh
        </span>

        {/* Right zone */}
        <div className="flex items-center justify-end flex-1 basis-0 min-w-0 gap-1.5">
          <GitHubStarButton />
          <button
            type="button"
            onClick={reset}
            className="size-7 min-w-7 flex items-center justify-center rounded-md cursor-pointer transition-all duration-200 hover:bg-muted/60 dark:hover:bg-white/[0.08] active:scale-90"
            title="Reset terminal"
            aria-label="Reset terminal"
          >
            <RotateCcw size={13} className="text-muted-foreground" />
            <span className="sr-only">Reset terminal</span>
          </button>
          <ModeToggle />
        </div>
      </div>

      {/* ── Body (content + spotify + input) ── */}
      <div
        className={cn(
          "flex flex-col flex-1 min-h-0",
          isMinimized
            ? "opacity-0 pointer-events-none transition-opacity duration-200 ease-out"
            : "opacity-100 transition-opacity duration-300 ease-in delay-150",
        )}
      >
        {/* ── Content Area ── */}
        <pre className="px-4 pt-4 flex-1 overflow-auto flex flex-col-reverse terminal-scrollbar">
          <code className="grid gap-4">{children}</code>
        </pre>

        {/* ── Spotify Status Bar (only visible when playing) ── */}
        <SpotifyPlayer />

        {/* ── Input Area ── */}
        <div className="px-4 py-3 border-t border-border/30 dark:border-white/[0.05]">
          <TerminalInput />
        </div>
      </div>
    </div>
  );
};
