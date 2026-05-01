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
import { useFormatter, useTranslations } from "next-intl";
import { getStats } from "@/app/actions";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { cn } from "@/lib/utils";
import type { StatsData } from "@/types/stats";

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
  const t = useTranslations("Commands.stats");
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
        <p className="text-muted-foreground text-xs leading-none">{label}</p>
        <p className="mt-0.5 truncate font-semibold text-foreground text-xs">
          {value ?? t("na")}
        </p>
      </div>
    </div>
  );
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
  const t = useTranslations("Commands.stats");
  const format = useFormatter();
  const year = new Date().getFullYear();
  const yearsOfCoding = data.codingSince
    ? t("codingSinceValue", {
        since: data.codingSince,
        years: year - data.codingSince,
      })
    : null;

  const stats: StatCardProps[] = [
    {
      icon: <Clock size={16} />,
      label: t("totalCodingTime"),
      value: data.wakatime.codingTime,
      color: "teal",
    },
    {
      icon: <Code size={16} />,
      label: t("topLanguage"),
      value: data.wakatime.topLanguage,
      color: "purple",
    },
    {
      icon: <Star size={16} />,
      label: t("githubStars"),
      value: data.totalStars !== null ? format.number(data.totalStars) : null,
      color: "gold",
    },
    {
      icon: <GitCommitHorizontal size={16} />,
      label: t("contributions", { year }),
      value:
        data.contributions !== null ? format.number(data.contributions) : null,
      color: "gold",
    },
    {
      icon: <Calendar size={16} />,
      label: t("codingSince"),
      value: yearsOfCoding,
      color: "orange",
    },
    {
      icon: <Eye size={16} />,
      label: t("visitors"),
      value: data.visitors !== null ? format.number(data.visitors) : null,
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
  const t = useTranslations("Commands.stats");
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStats(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading) return <StatsSkeleton />;
  if (!data)
    return (
      <AnimatedSpan className="gap-1">
        <p className="text-destructive">{t("failed")}</p>
      </AnimatedSpan>
    );

  return <StatsContent data={data} />;
}

export default CStats;
