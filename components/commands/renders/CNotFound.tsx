"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useCommands } from "@/components/providers/CommandsProvider";
import { ALL_COMMANDS, SUBCOMMAND_PREFIXES } from "@/lib/command-descriptors";

const PIPE_ONLY_COMMANDS = new Set([
  "grep",
  "head",
  "tail",
  "wc",
  "sort",
  "uniq",
  "less",
  "more",
  "cat",
]);

function levenshtein(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[a.length][b.length];
}

const ALL_COMMAND_NAMES = ALL_COMMANDS.map((c) => c.command);

function CNotFound({ input }: { input: string }) {
  const t = useTranslations("Commands.notFound");
  const { addCommand } = useCommands();

  const trimmed = input.trim().toLowerCase();
  const firstToken = trimmed.split(/\s+/, 1)[0] ?? "";
  const isPipeOnly = PIPE_ONLY_COMMANDS.has(firstToken);

  const suggestions = useMemo(() => {
    if (!trimmed) return [] as string[];

    const subPrefix = SUBCOMMAND_PREFIXES.find((p) => trimmed.startsWith(p));
    const candidates = subPrefix
      ? ALL_COMMAND_NAMES.filter((c) => c.startsWith(subPrefix))
      : ALL_COMMAND_NAMES;

    const startsWith = candidates.filter((c) => c.startsWith(trimmed));
    if (startsWith.length > 0) return startsWith.slice(0, 3);

    const maxDistance = Math.max(2, Math.ceil(trimmed.length / 3));
    return candidates
      .map((c) => ({ c, d: levenshtein(trimmed, c) }))
      .filter((x) => x.d <= maxDistance && x.c !== trimmed)
      .sort((a, b) => a.d - b.d || a.c.length - b.c.length)
      .slice(0, 3)
      .map((x) => x.c);
  }, [trimmed]);

  if (isPipeOnly) {
    const example = `help | ${firstToken} spotify`;
    return (
      <AnimatedSpan className="gap-1">
        <p className="font-mono text-destructive text-xs">
          {t("title", { input })}
        </p>
        <p className="mt-1 text-muted-foreground text-xs">
          {t.rich("pipeOnlyHint", {
            cmd: firstToken,
            example: () => (
              <button
                type="button"
                className="font-mono font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
                onClick={() => addCommand(example)}
              >
                {example}
              </button>
            ),
          })}
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan>
      <p className="font-mono text-destructive text-xs">
        {t("title", { input })}
      </p>
      {suggestions.length > 0 && (
        <p className="mt-1 text-muted-foreground text-xs">
          {t.rich("didYouMean", {
            suggestions: () => (
              <>
                {suggestions.map((s, idx) => (
                  <span key={s}>
                    <button
                      type="button"
                      className="font-mono font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
                      onClick={() => addCommand(s)}
                    >
                      {s}
                    </button>
                    {idx < suggestions.length - 1 ? ", " : ""}
                  </span>
                ))}
              </>
            ),
          })}
        </p>
      )}
    </AnimatedSpan>
  );
}

export default CNotFound;
