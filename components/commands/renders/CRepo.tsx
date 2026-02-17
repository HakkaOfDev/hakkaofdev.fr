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
import type { GitHubRepo } from "@/lib/types/github";
import { cn } from "@/lib/utils";

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium bg-chart-1/10 text-chart-1 ring-1 ring-inset ring-chart-1/20 hover:bg-chart-1/20 transition-colors duration-200 cursor-pointer"
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
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
      <span className="text-foreground font-semibold">{value}</span>
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
      <span className="text-foreground font-semibold">{language}</span>
    </span>
  );
}

function RepoCard({ repo }: { repo: GitHubRepo }) {
  const cloneUrl = `git clone ${SITE.repositoryUrl}.git`;

  return (
    <AnimatedSpan className="gap-3">
      <div className="border rounded-lg p-4 max-w-md space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={repo.html_url}
            target="_blank"
            className="group inline-flex items-center gap-2 min-w-0"
          >
            <Github size={16} className="shrink-0 text-muted-foreground" />
            <span className="font-semibold text-chart-2 group-hover:text-chart-2/80 transition-colors duration-200 truncate">
              {repo.full_name}
            </span>
            <ExternalLink
              size={12}
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground"
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
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 ring-1 ring-inset ring-border">
          <code className="flex-1 text-[11px] text-foreground font-mono truncate select-all">
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
      <div className="border rounded-lg p-4 max-w-md space-y-3 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted" />
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
    <AnimatedSpan className="gap-1">
      <p className="text-muted-foreground">Portfolio source repository:</p>
      <p>
        <Link
          href={SITE.repositoryUrl}
          target="_blank"
          className="font-semibold text-chart-2 hover:text-chart-2/80 transition-colors duration-200 break-all"
        >
          {SITE.repositoryUrl}
        </Link>
      </p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-muted-foreground">
          Clone:{" "}
          <span className="text-foreground font-semibold">{cloneUrl}</span>
        </p>
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
