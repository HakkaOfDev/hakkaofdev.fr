"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Code,
  Eye,
  GitCommitHorizontal,
  Star,
} from "lucide-react";
import { getStats } from "@/app/actions";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import type { StatsData } from "@/types/stats";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  color: string;
};

const COLOR_MAP: Record<string, { bg: string; ring: string; icon: string }> = {
  teal: {
    bg: "bg-primary/8",
    ring: "ring-primary/20",
    icon: "text-primary",
  },
  gold: {
    bg: "bg-secondary/8",
    ring: "ring-secondary/20",
    icon: "text-secondary",
  },
  purple: {
    bg: "bg-tertiary/8",
    ring: "ring-tertiary/20",
    icon: "text-tertiary",
  },
  orange: {
    bg: "bg-quaternary/8",
    ring: "ring-quaternary/20",
    icon: "text-quaternary",
  },
};

function StatCard({ icon, label, value, color }: StatCardProps) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.teal;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 ring-1 ring-inset",
        c.bg,
        c.ring,
      )}
    >
      <div className={cn("shrink-0", c.icon)}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-muted-foreground leading-none">
          {label}
        </p>
        <p className="mt-0.5 truncate font-semibold text-foreground text-xs">
          {value ?? "N/A"}
        </p>
      </div>
    </div>
  );
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function StatsSkeleton() {
  return (
    <AnimatedSpan className="gap-2">
      <div className="grid max-w-md grid-cols-2 gap-2">
        {["a", "b", "c", "d", "e", "f"].map((id) => (
          <div
            key={id}
            className="flex animate-pulse items-center gap-3 rounded-lg bg-muted/30 px-3 py-2.5 ring-1 ring-border/50 ring-inset"
          >
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-14 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </AnimatedSpan>
  );
}

function StatsContent({ data }: { data: StatsData }) {
  const year = new Date().getFullYear();
  const yearsOfCoding = data.codingSince
    ? `${data.codingSince} (${year - data.codingSince} yrs)`
    : null;

  const stats: StatCardProps[] = [
    {
      icon: <Clock size={16} />,
      label: "Total Coding Time",
      value: data.wakatime.codingTime,
      color: "teal",
    },
    {
      icon: <Code size={16} />,
      label: "Top Language",
      value: data.wakatime.topLanguage,
      color: "purple",
    },
    {
      icon: <Star size={16} />,
      label: "GitHub Stars",
      value: data.totalStars !== null ? formatNumber(data.totalStars) : null,
      color: "gold",
    },
    {
      icon: <GitCommitHorizontal size={16} />,
      label: `Contributions (${year})`,
      value:
        data.contributions !== null ? formatNumber(data.contributions) : null,
      color: "gold",
    },
    {
      icon: <Calendar size={16} />,
      label: "Coding Since",
      value: yearsOfCoding,
      color: "orange",
    },
    {
      icon: <Eye size={16} />,
      label: "Visitors",
      value: data.visitors !== null ? formatNumber(data.visitors) : null,
      color: "orange",
    },
  ];

  return (
    <AnimatedSpan className="gap-2">
      <div className="grid max-w-md grid-cols-2 gap-2">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </AnimatedSpan>
  );
}

function CStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading) return <StatsSkeleton />;
  if (!data)
    return (
      <AnimatedSpan className="gap-1">
        <p className="text-destructive">
          Failed to fetch stats. Try again later.
        </p>
      </AnimatedSpan>
    );

  return <StatsContent data={data} />;
}

export default CStats;
