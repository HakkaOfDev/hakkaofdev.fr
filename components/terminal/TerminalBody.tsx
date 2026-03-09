"use client";

import type { RefObject } from "react";
import { cn } from "@/lib/utils";
import { TerminalInput } from "./TerminalInput";

interface TerminalBodyProps {
  children: React.ReactNode;
  isMinimized: boolean;
  outputViewportRef: RefObject<HTMLPreElement | null>;
  onOutputScroll: () => void;
  spotifySlot: React.ReactNode;
}

function TerminalBody({
  children,
  isMinimized,
  outputViewportRef,
  onOutputScroll,
  spotifySlot,
}: TerminalBodyProps) {
  return (
    <div
      className={cn(
        "terminal-zoom-target flex min-h-0 min-w-0 flex-1 flex-col",
        isMinimized
          ? "pointer-events-none opacity-0 transition-opacity duration-200 ease-out"
          : "opacity-100 transition-opacity delay-150 duration-300 ease-in",
      )}
    >
      <pre
        ref={outputViewportRef}
        onScroll={onOutputScroll}
        className="terminal-scrollbar flex min-w-0 flex-1 flex-col-reverse overflow-y-auto overflow-x-hidden px-4 pt-4"
      >
        <code className="grid min-w-0 max-w-full gap-4">{children}</code>
      </pre>

      {spotifySlot}

      <div className="border-border/30 border-t px-4 py-2 dark:border-overlay-subtle">
        <TerminalInput />
      </div>
    </div>
  );
}

export { TerminalBody };
