"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Check,
  Circle,
  Copy,
  ExternalLink,
  GitFork,
  Github,
  Scale,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { getGitHubRepo } from "@/app/actions";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Tag } from "@/components/ui/Tag";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { GitHubRepo } from "@/types/github";

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    setTimeout(() => setStatus("idle"), 2000);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-primary/10 px-2 py-1 font-medium text-primary text-xs ring-1 ring-primary/20 ring-inset transition-colors duration-200 hover:bg-primary/20"
      aria-label={
        status === "copied"
          ? "Copied"
          : status === "failed"
            ? "Copy failed"
            : "Copy to clipboard"
      }
    >
      {status === "copied" ? <Check size={12} /> : <Copy size={12} />}
      {status === "copied" && "Copied!"}
      {status === "failed" && "Try again"}
      {status === "idle" && "Copy"}
    </button>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 text-muted-foreground"
      title={label}
    >
      {icon}
      <span className="font-semibold text-foreground">{value}</span>
    </span>
  );
}

function LanguageDot({ language }: { language: string }) {
  const colors: Record<string, string> = {
    TypeScript: "text-blue-400",
    JavaScript: "text-yellow-400",
    Python: "text-green-400",
    Rust: "text-orange-400",
    Go: "text-cyan-400",
  };

  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <Circle
        size={8}
        className={cn("fill-current", colors[language] ?? "text-gray-400")}
      />
      <span className="font-semibold text-foreground">{language}</span>
    </span>
  );
}

function RepoCard({ repo }: { repo: GitHubRepo }) {
  const cloneUrl = `git clone ${SITE.repositoryUrl}.git`;

  return (
    <AnimatedSpan className="gap-3">
      <div className="max-w-md space-y-3 rounded-lg border p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={repo.html_url}
            target="_blank"
            className="group inline-flex min-w-0 items-center gap-2"
          >
            <Github size={16} className="shrink-0 text-muted-foreground" />
            <span className="truncate font-semibold text-secondary transition-colors duration-200 group-hover:text-secondary/80">
              {repo.full_name}
            </span>
            <ExternalLink
              size={12}
              className="shrink-0 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
          </Link>
        </div>

        {/* Description */}
        {repo.description && (
          <p className="text-muted-foreground leading-relaxed">
            {repo.description}
          </p>
        )}

        {/* Topics */}
        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 6).map((topic) => (
              <Tag label={topic} key={topic} variant="gold" />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {repo.language && <LanguageDot language={repo.language} />}
          <Stat
            icon={<Star size={12} />}
            value={formatCount(repo.stargazers_count)}
            label="Stars"
          />
          <Stat
            icon={<GitFork size={12} />}
            value={formatCount(repo.forks_count)}
            label="Forks"
          />
          {repo.license && (
            <Stat
              icon={<Scale size={12} />}
              value={repo.license.spdx_id}
              label="License"
            />
          )}
        </div>

        {/* Clone */}
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 ring-1 ring-border ring-inset">
          <code className="flex-1 select-all truncate font-mono text-[11px] text-foreground">
            {cloneUrl}
          </code>
          <CopyButton text={cloneUrl} />
        </div>
      </div>
    </AnimatedSpan>
  );
}

function RepoSkeleton() {
  return (
    <AnimatedSpan className="gap-3">
      <div className="max-w-md animate-pulse space-y-3 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-muted" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-3/4 rounded bg-muted" />
        </div>
        <div className="flex gap-3">
          <div className="h-3 w-12 rounded bg-muted" />
          <div className="h-3 w-12 rounded bg-muted" />
          <div className="h-3 w-12 rounded bg-muted" />
        </div>
        <div className="h-8 w-full rounded bg-muted" />
      </div>
    </AnimatedSpan>
  );
}

function RepoFallback() {
  const cloneUrl = `git clone ${SITE.repositoryUrl}.git`;

  return (
    <AnimatedSpan className="gap-2">
      <p className="text-muted-foreground">
        Source code for this portfolio is available here:
      </p>
      <p>
        <Link
          href={SITE.repositoryUrl}
          target="_blank"
          className="break-all font-semibold text-secondary transition-colors duration-200 hover:text-secondary/80"
        >
          {SITE.repositoryUrl}
        </Link>
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <code className="rounded bg-muted/60 px-2 py-1 font-semibold text-[11px] text-foreground">
          {cloneUrl}
        </code>
        <CopyButton text={cloneUrl} />
      </div>
    </AnimatedSpan>
  );
}

function CRepo() {
  const { data, isLoading } = useQuery({
    queryKey: ["github-repo"],
    queryFn: getGitHubRepo,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading) return <RepoSkeleton />;
  if (!data) return <RepoFallback />;

  return <RepoCard repo={data} />;
}

export default CRepo;
