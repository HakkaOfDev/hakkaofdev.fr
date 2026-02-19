"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Command } from "@/types";
import CommandBash from "./CommandBash";
import { COMMAND_RENDERERS } from "./registries/registry";
import CEcho from "./renders/CEcho";
import CNotFound from "./renders/CNotFound";
import CGuestbook from "./renders/guestbook/CGuestbook";
import CSpotify from "./renders/spotify/CSpotify";
import CTheme from "./renders/theme/CTheme";

function CommandWrapper({
  children,
  id,
  input,
  timestamp,
}: { children: React.ReactNode } & Command) {
  const [show, setShow] = useState(false);
  const commandRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  useLayoutEffect(() => {
    if (!show) return;
    commandRef.current?.scrollIntoView({
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });
  }, [show]);

  return (
    <div
      ref={commandRef}
      id={`cmd-${id}`}
      className="flex w-full flex-col gap-2 pt-3 pb-4 first:pt-0"
    >
      <CommandBash input={input} timestamp={timestamp} />
      {!show ? (
        <div className="flex items-center gap-1.5 pl-5">
          <div className="h-1 w-1 animate-pulse rounded-full bg-primary/60" />
          <div className="h-1 w-1 animate-pulse rounded-full bg-primary/40 [animation-delay:150ms]" />
          <div className="h-1 w-1 animate-pulse rounded-full bg-primary/20 [animation-delay:300ms]" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function CommandItem({ id, input, timestamp }: Command) {
  const content = useMemo(() => {
    if (input.startsWith("echo ")) return <CEcho input={input} />;
    if (input === "guestbook" || input.startsWith("guestbook ")) {
      return <CGuestbook input={input} />;
    }
    if (input.startsWith("spotify")) return <CSpotify input={input} />;
    if (input === "theme" || input.startsWith("theme ")) {
      return <CTheme input={input} />;
    }

    const renderer = COMMAND_RENDERERS[input];
    if (!renderer) return <CNotFound input={input} />;
    return renderer();
  }, [input]);

  return (
    <CommandWrapper id={id} input={input} timestamp={timestamp}>
      {content}
    </CommandWrapper>
  );
}

export default CommandItem;
