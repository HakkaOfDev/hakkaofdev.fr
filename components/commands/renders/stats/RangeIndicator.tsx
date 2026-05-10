"use client";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { StatsRange } from "@/types/analytics";

/** Localized label for a stats range (e.g. "Last 7 days"). */
export function useRangeLabel() {
  const t = useTranslations("Commands.stats.range");
  return (range: StatsRange) => t(range);
}

export function RangeIndicator({
  range,
  unknown,
  className,
}: {
  range: StatsRange;
  unknown?: string[];
  className?: string;
}) {
  const t = useTranslations("Commands.stats");
  const tRange = useTranslations("Commands.stats.range");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 text-muted-foreground text-xs",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/40 px-2 py-0.5 ring-1 ring-border/40 ring-inset">
        <Calendar size={11} aria-hidden="true" />
        <span>
          {t("rangeLabel")}{" "}
          <span className="font-semibold text-foreground">{tRange(range)}</span>
        </span>
      </span>
      {unknown && unknown.length > 0 ? (
        <span className="text-[11px] text-destructive">
          {t("unknownFlag", { flag: unknown[0] ?? "" })}
        </span>
      ) : null}
    </div>
  );
}
