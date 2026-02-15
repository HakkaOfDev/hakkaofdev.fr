"use client";

import { Command } from "@/types";
import CommandBash from "./CommandBash";
import { useEffect, useMemo, useState } from "react";
import CNotFound from "./renders/CNotFound";
import { Loader } from "lucide-react";
import CSpotify from "./renders/spotify/CSpotify";
import { COMMAND_RENDERERS } from "./registry";

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
    <div id={`cmd-${id}`} className="flex flex-col gap-2 w-full pb-4">
      <CommandBash input={input} timestamp={timestamp} />
      {!show ? <Loader size={16} className="animate-spin" /> : children}
    </div>
  );
}

function CommandItem({ id, input, timestamp }: Command) {
  const content = useMemo(() => {
    if (input.startsWith("spotify")) return <CSpotify input={input} />;

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
