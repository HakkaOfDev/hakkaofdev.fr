"use client";

import { RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CycleTheme } from "./CycleTheme";
import { GitHubStarButton } from "./GitHubStarButton";
import { useCommands } from "./providers/CommandsProvider";
import { useTerminal } from "./providers/TerminalProvider";
import TerminalInput from "./TerminalInput";
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
        "terminal-shadow terminal-resize z-0 flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-background dark:border-overlay-medium",
        isMinimized
          ? "max-h-11"
          : isMaximized
            ? "max-h-[calc(100dvh-120px)]"
            : "max-h-[calc(100dvh-120px)] md:max-h-[450px]",
        className,
      )}
    >
      {/* ── Title Bar ── */}
      <div className="flex h-11 shrink-0 select-none items-center border-border/50 border-b bg-muted/40 px-4 dark:border-overlay-subtle dark:bg-overlay-subtle">
        {/* Left zone */}
        <div className="flex min-w-0 flex-1 basis-0 items-center">
          <TrafficLights />
        </div>

        {/* Center zone — title */}
        <span className="shrink-0 font-medium text-[11px] text-muted-foreground/80 tracking-wide">
          {SITE.handle} &mdash; zsh
        </span>

        {/* Right zone */}
        <div className="flex min-w-0 flex-1 basis-0 items-center justify-end gap-1.5">
          <GitHubStarButton />
          <button
            type="button"
            onClick={reset}
            className="flex size-7 min-w-7 cursor-pointer items-center justify-center rounded-md transition-all duration-200 hover:bg-muted/60 active:scale-90 dark:hover:bg-overlay-medium"
            title="Reset terminal"
            aria-label="Reset terminal"
          >
            <RotateCcw size={13} className="text-muted-foreground" />
            <span className="sr-only">Reset terminal</span>
          </button>
          <CycleTheme />
        </div>
      </div>

      {/* ── Body (content + spotify + input) ── */}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          isMinimized
            ? "pointer-events-none opacity-0 transition-opacity duration-200 ease-out"
            : "opacity-100 transition-opacity delay-150 duration-300 ease-in",
        )}
      >
        {/* ── Content Area ── */}
        <pre className="terminal-scrollbar flex flex-1 flex-col-reverse overflow-auto px-4 pt-4">
          <code className="grid gap-4">{children}</code>
        </pre>

        {/* ── Spotify Status Bar (only visible when playing) ── */}
        <SpotifyPlayer />

        {/* ── Input Area ── */}
        <div className="border-border/30 border-t px-4 py-3 dark:border-overlay-subtle">
          <TerminalInput />
        </div>
      </div>
    </div>
  );
};
