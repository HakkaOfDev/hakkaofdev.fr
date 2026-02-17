"use client";

import { useMemo } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useCommands } from "@/components/CommandsProvider";
import { ALL_COMMANDS } from "@/components/commands/command-descriptors";

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
  const { addCommand } = useCommands();

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [] as string[];

    const candidates = q.startsWith("spotify")
      ? ALL_COMMAND_NAMES.filter((c) => c.startsWith("spotify"))
      : q.startsWith("theme")
        ? ALL_COMMAND_NAMES.filter((c) => c.startsWith("theme"))
        : ALL_COMMAND_NAMES;

    const startsWith = candidates.filter((c) => c.startsWith(q));
    if (startsWith.length > 0) return startsWith.slice(0, 3);

    const maxDistance = Math.max(2, Math.ceil(q.length / 3));
    return candidates
      .map((c) => ({ c, d: levenshtein(q, c) }))
      .filter((x) => x.d <= maxDistance && x.c !== q)
      .sort((a, b) => a.d - b.d || a.c.length - b.c.length)
      .slice(0, 3)
      .map((x) => x.c);
  }, [input]);

  return (
    <AnimatedSpan>
      <p className="text-destructive font-mono text-xs">
        zsh: command not found: {input}
      </p>
      {suggestions.length > 0 && (
        <p className="text-muted-foreground text-xs mt-1">
          Did you mean{" "}
          {suggestions.map((s, idx) => (
            <span key={s}>
              <button
                type="button"
                className="text-chart-1 hover:text-chart-1/80 transition-colors duration-200 font-semibold font-mono"
                onClick={() => addCommand(s)}
              >
                {s}
              </button>
              {idx < suggestions.length - 1 ? ", " : ""}
            </span>
          ))}
          ?
        </p>
      )}
    </AnimatedSpan>
  );
}

export default CNotFound;
