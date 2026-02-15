"use client";

import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useCommands } from "@/components/CommandsProvider";
import {
  COMMANDS,
  SPOTIFY_COMMANDS,
} from "@/components/commands/command-descriptors";
import { useMemo } from "react";

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

function CNotFound({ input }: { input: string }) {
  const { addCommand } = useCommands();

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [] as string[];

    const base = COMMANDS.map((c) => c.command);
    const spotify = ["spotify", ...SPOTIFY_COMMANDS.map((c) => `spotify ${c.command}`)];

    const candidates = Array.from(
      new Set(q.startsWith("spotify") ? spotify : [...base, ...spotify]),
    );

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
      <p className="text-destructive">Command &apos;{input}&apos; was not found.</p>
      {suggestions.length > 0 && (
        <p className="text-muted-foreground">
          Did you mean{" "}
          {suggestions.map((s, idx) => (
            <span key={s}>
              <button
                type="button"
                className="text-chart-2 hover:text-chart-2/80 transition-colors duration-200 font-semibold"
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
