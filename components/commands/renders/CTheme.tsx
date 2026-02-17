"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { THEME_COMMANDS } from "@/components/commands/command-descriptors";
import SubCommandRouter from "./SubCommandRouter";

function CTheme({ input }: { input: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleValidEffect = useCallback(
    (mode: string) => setTheme(mode),
    [setTheme],
  );

  return (
    <SubCommandRouter
      input={input}
      commands={THEME_COMMANDS}
      prefix="theme"
      title="Theme commands"
      variant="orange"
      subcommandLabel="mode"
      status={
        <p className="text-muted-foreground">
          Current theme:{" "}
          <span className="text-foreground font-semibold">
            {resolvedTheme ?? theme ?? "system"}
          </span>
        </p>
      }
      onValidEffect={handleValidEffect}
      renderValid={(mode) => (
        <AnimatedSpan className="gap-1">
          <p className="text-muted-foreground">
            Theme updated to{" "}
            <span className="text-foreground font-semibold">{mode}</span>.
          </p>
          <p className="text-muted-foreground">
            Active theme:{" "}
            <span className="text-foreground font-semibold">
              {resolvedTheme ?? theme ?? mode}
            </span>
          </p>
        </AnimatedSpan>
      )}
    />
  );
}

export default CTheme;
