"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Link from "next/link";
import { getGitHubRepo } from "@/app/actions";
import { SITE } from "@/lib/constants";

export function GitHubStarButton() {
  const { data, isError } = useQuery({
    queryKey: ["github-repo"],
    queryFn: getGitHubRepo,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isError) return null

  return (
    <Link
      href={SITE.repositoryUrl}
      target="_blank"
      title="Star on GitHub"
      aria-label="Star on GitHub"
      className="h-6 flex items-center gap-1.5 rounded-md border border-border/60 dark:border-white/[0.08] bg-muted/40 dark:bg-white/[0.04] px-2 text-[11px] font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/70 dark:hover:bg-white/[0.08] hover:text-foreground active:scale-95 select-none"
    >
      <Star size={12} className="fill-chart-2 text-chart-2 shrink-0" />
      {data ? (
        <span className="tabular-nums">{data.stargazers_count}</span>
      ) : (
        <span className="w-5 h-2.5 rounded-sm bg-muted-foreground/20 animate-pulse" />
      )}
    </Link>
  );
}
