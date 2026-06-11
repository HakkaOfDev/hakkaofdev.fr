"use client";

import { type QueryKey, useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { RevealSwap } from "@/components/AnimatedComponents";
import { CommandLoader } from "@/components/commands/CommandLoader";
import SpotifyUnavailable from "./SpotifyUnavailable";

export default function SpotifyQuery<T>({
  queryKey,
  queryFn,
  children,
  refetchInterval,
}: {
  queryKey: QueryKey;
  queryFn: () => Promise<T | null>;
  children: (data: T) => ReactNode;
  refetchInterval?: number;
}) {
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => queryFn(),
    refetchInterval,
    retry: false,
  });

  // Reuse the command's own pulsing-dots loader so the loading state stays
  // identical from the artificial beat through to the real data.
  return (
    <RevealSwap loading={isLoading} skeleton={<CommandLoader />}>
      {!data ? <SpotifyUnavailable /> : children(data)}
    </RevealSwap>
  );
}
