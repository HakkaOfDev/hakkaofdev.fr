"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { Pipeline } from "@/types";

const PipelineContext = createContext<Pipeline | null>(null);

export function PipelineProvider({
  pipeline,
  children,
}: {
  pipeline?: Pipeline | null;
  children: ReactNode;
}) {
  return (
    <PipelineContext.Provider value={pipeline ?? null}>
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline(): Pipeline | null {
  return useContext(PipelineContext);
}

/**
 * Lower-cased grep pattern from the active pipeline (or "" if none).
 * Use this to filter list rows against their visible, localized text.
 */
export function useGrep(): string {
  const pipeline = useContext(PipelineContext);
  return pipeline?.grep?.toLowerCase() ?? "";
}

/** Original-case grep pattern (for display in headers / "no matches" copy). */
export function useGrepRaw(): string {
  const pipeline = useContext(PipelineContext);
  return pipeline?.grep ?? "";
}
