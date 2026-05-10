"use client";

import type { ReactNode } from "react";
import type { StatsRange } from "@/types/analytics";
import { CStatsBrowsers } from "../renders/stats/CStatsBrowsers";
import { CStatsCountries } from "../renders/stats/CStatsCountries";
import { CStatsOverview } from "../renders/stats/CStatsOverview";
import { CStatsReferrers } from "../renders/stats/CStatsReferrers";
import { CStatsTrend } from "../renders/stats/CStatsTrend";

export type { StatsCommandDescriptor } from "../../../lib/command-descriptors";
export { STATS_COMMANDS } from "../../../lib/command-descriptors";

type RangeProps = { range?: StatsRange; unknown?: string[] };

type StatsCommandRenderer = {
  overview: (props: RangeProps) => ReactNode;
  countries: (props: RangeProps) => ReactNode;
  browsers: (props: RangeProps) => ReactNode;
  referrers: (props: RangeProps) => ReactNode;
  trend: (props: RangeProps) => ReactNode;
};

export const STATS_COMMAND_RENDERERS: StatsCommandRenderer = {
  overview: (props) => <CStatsOverview {...props} />,
  countries: (props) => <CStatsCountries {...props} />,
  browsers: (props) => <CStatsBrowsers {...props} />,
  referrers: (props) => <CStatsReferrers {...props} />,
  trend: (props) => <CStatsTrend {...props} />,
};
