"use client";

import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { resolveTerminalRenderer } from "@/components/commands/registries/commands.registry";
import { PipelineProvider } from "@/components/providers/PipelineProvider";
import type { Command, Pipeline } from "@/types";
import CommandBash from "./CommandBash";
import CNotFound from "./renders/CNotFound";

type CommandResolutionState =
  | { status: "loading" }
  | { status: "not-found" }
  | {
      status: "ready";
      needsInput: boolean;
      normalizedInput: string;
      pipeline?: Pipeline;
      Component:
        | React.ComponentType<{ input: string }>
        | React.ComponentType<Record<string, never>>;
    };

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
    const commandElement = commandRef.current;
    if (!commandElement || commandElement.offsetParent === null) return;
    commandElement.scrollIntoView({
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });
  }, [show]);

  return (
    <div
      ref={commandRef}
      id={`cmd-${id}`}
      className="flex w-full scroll-mt-3 flex-col gap-2 pt-3 pb-4 first:pt-0"
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
  const [resolution, setResolution] = useState<CommandResolutionState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    const loadRenderer = async () => {
      const renderer = await resolveTerminalRenderer(input);
      if (cancelled) return;
      if (!renderer) return setResolution({ status: "not-found" });

      setResolution({
        status: "ready",
        needsInput: renderer.needsInput,
        normalizedInput: renderer.normalizedInput,
        pipeline: renderer.pipeline,
        Component: renderer.Component,
      });
    };

    void loadRenderer();
    return () => {
      cancelled = true;
    };
  }, [input]);

  const pipeline = resolution.status === "ready" ? resolution.pipeline : null;

  const content = (() => {
    if (resolution.status === "loading") {
      return (
        <p className="pl-5 font-mono text-muted-foreground/50 text-xs">
          Resolving command…
        </p>
      );
    }
    if (resolution.status === "not-found") {
      return <CNotFound input={input} />;
    }

    const { Component, needsInput, normalizedInput } = resolution;
    if (needsInput) {
      const InputComponent = Component as React.ComponentType<{
        input: string;
      }>;
      return <InputComponent input={normalizedInput} />;
    }

    const StaticComponent = Component as React.ComponentType<
      Record<string, never>
    >;
    return <StaticComponent />;
  })();

  return (
    <CommandWrapper id={id} input={input} timestamp={timestamp}>
      <PipelineProvider pipeline={pipeline}>{content}</PipelineProvider>
    </CommandWrapper>
  );
}

export default memo(CommandItem);
