"use client";

import { type QueryKey, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import type { ReactNode } from "react";
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
    queryFn,
    refetchInterval,
    retry: false,
  });

  if (isLoading) return <Loader size={16} className="animate-spin" />;
  if (!data) return <SpotifyUnavailable />;

  return children(data);
}
