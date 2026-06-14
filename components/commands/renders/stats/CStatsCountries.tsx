"use client";

import { useQuery } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getVisitorCountries } from "@/app/actions";
import { AnimatedSpan, RevealSwap } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart";
import { countryCodeToFlag, countryName } from "@/lib/utils/country.utils";
import { filterByGrep } from "@/lib/utils/grep.utils";
import type { StatsRange } from "@/types/analytics";
import { RangeIndicator } from "./RangeIndicator";
import { CountriesSkeleton } from "./StatsSkeletons";

const TOP_N = 10;

export function CStatsCountries({
  range = "all",
  unknown = [],
}: {
  range?: StatsRange;
  unknown?: string[];
}) {
  const t = useTranslations("Commands.stats");
  const tCommands = useTranslations("Commands");
  const locale = useLocale();
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const { data, isLoading } = useQuery({
    queryKey: ["stats", "countries", range],
    queryFn: () => getVisitorCountries(range),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const enriched = useMemo(() => {
    if (!data) return [];
    return data.map((row) => ({
      ...row,
      flag: countryCodeToFlag(row.country),
      name: countryName(row.country, locale),
    }));
  }, [data, locale]);

  const visible = useMemo(
    () => filterByGrep(enriched, grep, (row) => [row.country, row.name]),
    [enriched, grep],
  );

  const chartData = useMemo(
    () =>
      visible.slice(0, TOP_N).map((row) => ({
        label: `${row.flag} ${row.country}`,
        unique_count: row.unique_count,
        name: row.name,
      })),
    [visible],
  );

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      unique_count: {
        label: t("visitors"),
        color: "var(--tertiary)",
      },
    }),
    [t],
  );

  if (!data && !isLoading) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">{t("failed")}</p>
      </AnimatedSpan>
    );
  }

  if (visible.length === 0 && !isLoading) {
    return (
      <AnimatedSpan className="gap-2">
        <RangeIndicator range={range} unknown={unknown} />
        <div className="flex items-center gap-1.5">
          <Globe size={12} className="text-tertiary" />
          <p className="font-semibold text-foreground text-xs">
            {t("countriesTitle")}
          </p>
        </div>
        <p className="text-muted-foreground text-xs">
          {grep
            ? tCommands("noMatches", { pattern: grepRaw })
            : t("emptyCountries")}
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <RevealSwap loading={isLoading} skeleton={<CountriesSkeleton />}>
      <AnimatedSpan className="gap-3">
        <RangeIndicator range={range} unknown={unknown} />
        <div className="flex items-center gap-1.5">
          <Globe size={12} className="text-tertiary" />
          <p className="font-semibold text-foreground text-xs">
            {t("countriesTitle")}{" "}
            <span className="font-normal text-muted-foreground">
              ({t("uniqueByCountry", { count: visible.length })})
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
              width={64}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(_label, payload) =>
                    payload?.[0]?.payload?.name ?? _label
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
