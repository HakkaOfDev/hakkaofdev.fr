"use client";

import { useQuery } from "@tanstack/react-query";
import { Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { getBrowserBreakdown } from "@/app/actions";
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
import { BrowsersSkeleton } from "./StatsSkeletons";

const PALETTE = [
  "var(--primary)",
  "var(--secondary)",
  "var(--tertiary)",
  "var(--quaternary)",
  "var(--quinary)",
  "var(--muted-foreground)",
];

export function CStatsBrowsers({
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
    queryKey: ["stats", "browsers", range],
    queryFn: () => getBrowserBreakdown(range),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const visible = useMemo(() => {
    if (!data) return [];
    return filterByGrep(data, grep, (row) => [row.browser]);
  }, [data, grep]);

  const chartData = useMemo(
    () =>
      visible.map((row, i) => ({
        browser: row.browser,
        unique_count: row.unique_count,
        fill: PALETTE[i % PALETTE.length] ?? "var(--muted-foreground)",
      })),
    [visible],
  );

  const config = useMemo<ChartConfig>(() => {
    const c: ChartConfig = {
      unique_count: { label: t("visitors") },
    };
    visible.forEach((row, i) => {
      c[row.browser] = {
        label: row.browser,
        color: PALETTE[i % PALETTE.length],
      };
    });
    return c;
  }, [visible, t]);

  const total = visible.reduce((sum, row) => sum + row.unique_count, 0);

  return (
    <RevealSwap loading={isLoading} skeleton={<BrowsersSkeleton />}>
      {!data ? (
        <AnimatedSpan className="gap-2">
          <p className="text-destructive">{t("failed")}</p>
        </AnimatedSpan>
      ) : visible.length === 0 ? (
        <AnimatedSpan className="gap-2">
          <RangeIndicator range={range} unknown={unknown} />
          <div className="flex items-center gap-1.5">
            <Monitor size={12} className="text-secondary" />
            <p className="font-semibold text-foreground text-xs">
              {t("browsersTitle")}
            </p>
          </div>
          <p className="text-muted-foreground text-xs">
            {grep
              ? tCommands("noMatches", { pattern: grepRaw })
              : t("emptyBrowsers")}
          </p>
        </AnimatedSpan>
      ) : (
        <AnimatedSpan className="gap-3">
          <RangeIndicator range={range} unknown={unknown} />
          <div className="flex items-center gap-1.5">
            <Monitor size={12} className="text-secondary" />
            <p className="font-semibold text-foreground text-xs">
              {t("browsersTitle")}
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-1 items-center gap-3 sm:grid-cols-[200px_1fr]">
            <ChartContainer
              config={config}
              className="mx-auto aspect-square h-40 w-40"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="unique_count"
                  nameKey="browser"
                  innerRadius={42}
                  strokeWidth={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.browser} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="grid gap-1.5 text-xs">
              {chartData.map((row) => {
                const pct = total > 0 ? (row.unique_count / total) * 100 : 0;
                return (
                  <div
                    key={row.browser}
                    className="grid grid-cols-[12px_1fr_auto] items-center gap-2"
                  >
                    <span
                      className="block h-3 w-3 rounded-sm"
                      style={{ backgroundColor: row.fill }}
                      aria-hidden="true"
                    />
                    <span className="truncate text-foreground">
                      {row.browser}
                    </span>
                    <span className="text-right text-muted-foreground tabular-nums">
                      <span className="font-semibold text-foreground">
                        {row.unique_count}
                      </span>{" "}
                      <span className="text-[10px]">({pct.toFixed(0)}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSpan>
      )}
    </RevealSwap>
  );
}
