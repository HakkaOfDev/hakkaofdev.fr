"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useId, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getVisitorTrend } from "@/app/actions";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart";
import type { StatsRange } from "@/types/analytics";
import { RangeIndicator } from "./RangeIndicator";
import { TrendSkeleton } from "./StatsSkeletons";

export function CStatsTrend({
  range = "30d",
  unknown = [],
}: {
  range?: StatsRange;
  unknown?: string[];
}) {
  const t = useTranslations("Commands.stats");
  const format = useFormatter();
  const locale = useLocale();
  const gradientId = useId();

  const effective: StatsRange = range === "all" ? "90d" : range;

  const { data, isLoading } = useQuery({
    queryKey: ["stats", "trend", effective],
    queryFn: () => getVisitorTrend(effective),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
      }),
    [locale],
  );

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      unique_count: {
        label: t("visitors"),
        color: "var(--primary)",
      },
    }),
    [t],
  );

  if (isLoading) return <TrendSkeleton />;

  if (!data) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">{t("failed")}</p>
      </AnimatedSpan>
    );
  }

  if (data.length === 0) {
    return (
      <AnimatedSpan className="gap-2">
        <RangeIndicator range={effective} unknown={unknown} />
        <p className="text-muted-foreground text-xs">{t("emptyTrend")}</p>
      </AnimatedSpan>
    );
  }

  const values = data.map((d) => d.unique_count);
  const total = values.reduce((sum, v) => sum + v, 0);
  const max = Math.max(...values);
  const avg = total / values.length;

  const chartData = data.map((point) => ({
    bucket: point.bucket,
    label: dateFormatter.format(new Date(`${point.bucket}T00:00:00Z`)),
    unique_count: point.unique_count,
  }));

  return (
    <AnimatedSpan className="gap-3">
      <RangeIndicator range={effective} unknown={unknown} />

      <div className="flex items-center gap-1.5">
        <TrendingUp size={12} className="text-primary" />
        <p className="font-semibold text-foreground text-xs">
          {t("trendTitle")}
        </p>
      </div>

      <div className="grid max-w-xl grid-cols-3 gap-2 text-[11px]">
        <div className="rounded-md bg-primary/8 px-3 py-2 ring-1 ring-primary/20 ring-inset">
          <p className="text-muted-foreground">{t("trendTotal")}</p>
          <p className="font-semibold text-foreground tabular-nums">
            {format.number(total)}
          </p>
        </div>
        <div className="rounded-md bg-secondary/8 px-3 py-2 ring-1 ring-secondary/20 ring-inset">
          <p className="text-muted-foreground">{t("trendPeak")}</p>
          <p className="font-semibold text-foreground tabular-nums">
            {format.number(max)}
          </p>
        </div>
        <div className="rounded-md bg-tertiary/8 px-3 py-2 ring-1 ring-tertiary/20 ring-inset">
          <p className="text-muted-foreground">{t("trendAvg")}</p>
          <p className="font-semibold text-foreground tabular-nums">
            {format.number(Math.round(avg))}
          </p>
        </div>
      </div>

      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-44 w-full max-w-xl"
      >
        <AreaChart
          data={chartData}
          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-unique_count)"
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor="var(--color-unique_count)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            minTickGap={24}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            width={28}
            tick={{ fontSize: 10 }}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--color-unique_count)", strokeWidth: 1 }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            type="monotone"
            dataKey="unique_count"
            stroke="var(--color-unique_count)"
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ChartContainer>
    </AnimatedSpan>
  );
}
