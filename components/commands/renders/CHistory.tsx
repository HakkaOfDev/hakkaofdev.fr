"use client";

import { Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { AnimatedSpan, RevealGroup } from "@/components/AnimatedComponents";
import { useCommands } from "@/components/providers/CommandsProvider";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { Shortcut } from "@/components/ui/Shortcut";

function formatTimestamp(date: Date, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return date.toISOString().slice(11, 19);
  }
}

function CHistory() {
  const t = useTranslations("History");
  const { commands } = useCommands();
  const locale = useLocale();

  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const rows = useMemo(() => {
    // Drop the trailing entry, which is the `history` invocation itself.
    const allRows = commands.slice(0, -1).map((cmd, index) => ({
      id: cmd.id,
      index: index + 1,
      input: cmd.input,
      timestamp: cmd.timestamp,
    }));
    if (!grep) return allRows;
    return allRows.filter((row) => row.input.toLowerCase().includes(grep));
  }, [commands, grep]);

  if (rows.length === 0) {
    return (
      <AnimatedSpan className="gap-2">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
          <p className="font-semibold text-primary">{t("title")}</p>
        </div>
        <p className="text-muted-foreground text-xs">
          {grep ? t("noMatches", { pattern: grepRaw }) : t("empty")}
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan className="gap-3">
      <div className="flex items-center gap-2">
        <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="font-semibold text-primary">
          {t("title")}{" "}
          <span className="text-muted-foreground">({rows.length})</span>
        </p>
      </div>

      <RevealGroup className="grid grid-cols-[auto_max-content_1fr] items-center gap-x-3 gap-y-1.5">
        {rows.map((row) => (
          <div
            key={row.id}
            className="col-span-3 grid grid-cols-subgrid items-center"
          >
            <span className="text-right font-mono text-muted-foreground/50 text-xs tabular-nums">
              {row.index}
            </span>
            <span className="font-mono text-muted-foreground/60 text-xs tabular-nums">
              {formatTimestamp(row.timestamp, locale)}
            </span>
            <Shortcut
              label={row.input}
              command={row.input}
              className="justify-self-start truncate"
            />
          </div>
        ))}
      </RevealGroup>
    </AnimatedSpan>
  );
}

export default CHistory;
