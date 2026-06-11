"use client";

import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getReferrerBreakdown } from "@/app/actions";
import { AnimatedSpan, RevealSwap } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart";
import { filterByGrep } from "@/lib/utils/grep.utils";
import type { StatsRange } from "@/types/analytics";
import { RangeIndicator } from "./RangeIndicator";
import { ReferrersSkeleton } from "./StatsSkeletons";

const TOP_N = 10;
const HOST_LABEL_MAX = 24;

function shortenHost(host: string): string {
  if (host.length <= HOST_LABEL_MAX) return host;
  return `${host.slice(0, HOST_LABEL_MAX - 1)}…`;
}

export function CStatsReferrers({
  range = "all",
  unknown = [],
}: {
  range?: StatsRange;
  unknown?: string[];
}) {
  const t = useTranslations("Commands.stats");
  const tCommands = useTranslations("Commands");
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const { data, isLoading } = useQuery({
    queryKey: ["stats", "referrers", range],
    queryFn: () => getReferrerBreakdown(range),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const visible = useMemo(
    () => filterByGrep(data ?? [], grep, (row) => [row.host]),
    [data, grep],
  );

  const chartData = useMemo(
    () =>
      visible.slice(0, TOP_N).map((row) => ({
        host: row.host,
        label: shortenHost(row.host),
        unique_count: row.unique_count,
      })),
    [visible],
  );

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      unique_count: {
        label: t("visitors"),
        color: "var(--quaternary)",
      },
    }),
    [t],
  );

  if (!data) {
    return (
      <RevealSwap loading={isLoading} skeleton={<ReferrersSkeleton />}>
        <AnimatedSpan className="gap-2">
          <p className="text-destructive">{t("failed")}</p>
        </AnimatedSpan>
      </RevealSwap>
    );
  }

  if (visible.length === 0) {
    return (
      <RevealSwap loading={isLoading} skeleton={<ReferrersSkeleton />}>
        <AnimatedSpan className="gap-2">
          <RangeIndicator range={range} unknown={unknown} />
          <div className="flex items-center gap-1.5">
            <ExternalLink size={12} className="text-quaternary" />
            <p className="font-semibold text-foreground text-xs">
              {t("referrersTitle")}
            </p>
          </div>
          <p className="text-muted-foreground text-xs">
            {grep
              ? tCommands("noMatches", { pattern: grepRaw })
              : t("emptyReferrers")}
          </p>
        </AnimatedSpan>
      </RevealSwap>
    );
  }

  return (
    <RevealSwap loading={isLoading} skeleton={<ReferrersSkeleton />}>
      <AnimatedSpan className="gap-3">
        <RangeIndicator range={range} unknown={unknown} />
        <div className="flex items-center gap-1.5">
          <ExternalLink size={12} className="text-quaternary" />
          <p className="font-semibold text-foreground text-xs">
            {t("referrersTitle")}{" "}
            <span className="font-normal text-muted-foreground">
              ({t("uniqueByReferrer", { count: visible.length })})
            </span>
          </p>
        </div>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full max-w-xl"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              width={140}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(_label, payload) =>
                    payload?.[0]?.payload?.host ?? _label
                  }
                />
              }
            />
            <Bar
              dataKey="unique_count"
              fill="var(--color-unique_count)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </AnimatedSpan>
    </RevealSwap>
  );
}
