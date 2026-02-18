"use client";

import { useEffect, useMemo, useState } from "react";
import type { Command } from "@/types";
import CommandBash from "./CommandBash";
import { COMMAND_RENDERERS } from "./registries/registry";
import CEcho from "./renders/CEcho";
import CNotFound from "./renders/CNotFound";
import CTheme from "./renders/CTheme";
import CGuestbook from "./renders/guestbook/CGuestbook";
import CSpotify from "./renders/spotify/CSpotify";

function CommandWrapper({
  children,
  id,
  input,
  timestamp,
}: { children: React.ReactNode } & Command) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      id={`cmd-${id}`}
      className="flex flex-col gap-2 w-full pt-3 first:pt-0 pb-4"
    >
      <CommandBash input={input} timestamp={timestamp} />
      {!show ? (
        <div className="flex items-center gap-1.5 pl-5">
          <div className="h-1 w-1 rounded-full bg-chart-1/60 animate-pulse" />
          <div className="h-1 w-1 rounded-full bg-chart-1/40 animate-pulse [animation-delay:150ms]" />
          <div className="h-1 w-1 rounded-full bg-chart-1/20 animate-pulse [animation-delay:300ms]" />
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
