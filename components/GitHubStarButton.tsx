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

  if (isError) return null;

  return (
    <Link
      href={SITE.repositoryUrl}
      target="_blank"
      title="Star on GitHub"
      aria-label="Star on GitHub"
      className="flex h-6 select-none items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2 font-medium text-[11px] text-muted-foreground transition-all duration-200 hover:bg-muted/70 hover:text-foreground active:scale-95 dark:border-overlay-medium dark:bg-overlay-subtle dark:hover:bg-overlay-medium"
    >
      <Star size={12} className="shrink-0 fill-secondary text-secondary" />
      {data ? (
        <span className="tabular-nums">{data.stargazers_count}</span>
      ) : (
        <span className="h-2.5 w-5 animate-pulse rounded-sm bg-muted-foreground/20" />
      )}
    </Link>
  );
}
