"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import {
  STATS_COMMAND_RENDERERS,
  STATS_COMMANDS,
} from "@/components/commands/registries/stats.registry";
import { parseStatsArgs } from "@/lib/utils/stats-args.utils";
import type { StatsRange } from "@/types/analytics";
import SubCommandHelp from "../SubCommandHelp";

const VALID_SUBCOMMANDS = new Set<string>(STATS_COMMANDS.map((c) => c.command));

const SUB_NAMES = STATS_COMMANDS.map((c) => c.command);

function CStats({ input }: { input: string }) {
  const t = useTranslations("Commands.stats");
  const tRouter = useTranslations("Commands.subCommandRouter");

  const parsed = useMemo(() => parseStatsArgs(input), [input]);
  const range: StatsRange = parsed.range ?? "all";
  const unknown = parsed.unknown;
  const sub = parsed.subcommand;

  if (!sub) {
    return (
      <AnimatedSpan className="gap-3">
        {STATS_COMMAND_RENDERERS.overview({ range, unknown })}
        <p className="text-muted-foreground">
          {tRouter("usagePrefix")}{" "}
          <span className="font-semibold text-foreground">
            stats [{SUB_NAMES.join(" | ")}]{" "}
            <span className="font-normal text-muted-foreground">
              [--last 24h|7d|30d|90d|all]
            </span>
          </span>
        </p>
        <SubCommandHelp
          title={t("subCommandsTitle")}
          items={STATS_COMMANDS}
          prefix="stats "
          variant="secondary"
        />
      </AnimatedSpan>
    );
  }

  if (!VALID_SUBCOMMANDS.has(sub)) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">
          {t("unknownSub", { sub, options: SUB_NAMES.join(", ") })}
        </p>
        <SubCommandHelp
          title={t("subCommandsTitle")}
          items={STATS_COMMANDS}
          prefix="stats "
          variant="secondary"
        />
      </AnimatedSpan>
    );
  }

  switch (sub) {
    case "countries":
      return STATS_COMMAND_RENDERERS.countries({ range, unknown });
    case "browsers":
      return STATS_COMMAND_RENDERERS.browsers({ range, unknown });
    case "referrers":
      return STATS_COMMAND_RENDERERS.referrers({ range, unknown });
    case "trend":
      return STATS_COMMAND_RENDERERS.trend({ range, unknown });
    default:
      return STATS_COMMAND_RENDERERS.overview({ range, unknown });
  }
}

export default CStats;
