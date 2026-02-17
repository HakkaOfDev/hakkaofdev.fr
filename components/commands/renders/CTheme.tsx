"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { THEME_COMMANDS } from "@/components/commands/command-descriptors";
import SubCommandHelp from "./SubCommandHelp";

const VALID_MODES = new Set(THEME_COMMANDS.map((c) => c.command));

function CTheme({ input }: { input: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const parsed = useMemo(() => {
    const parts = input.trim().split(/\s+/).filter(Boolean);
    return {
      mode: parts[1] as "dark" | "light" | "system" | undefined,
      hasExtraArgs: parts.length > 2,
    };
  }, [input]);

  const isValidMode = Boolean(parsed.mode && VALID_MODES.has(parsed.mode));

  useEffect(() => {
    if (!parsed.mode || !isValidMode || parsed.hasExtraArgs) return;
    setTheme(parsed.mode);
  }, [parsed.mode, parsed.hasExtraArgs, isValidMode, setTheme]);

  if (!parsed.mode) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-muted-foreground mb-2">
          Current theme:{" "}
          <span className="text-foreground font-semibold">
            {resolvedTheme ?? theme ?? "system"}
          </span>
        </p>
        <SubCommandHelp
          title="Theme commands"
          items={THEME_COMMANDS}
          prefix="theme "
          variant="orange"
        />
      </AnimatedSpan>
    );
  }

  if (!isValidMode || parsed.hasExtraArgs) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">
          Invalid theme mode. Use one of: dark, light, system.
        </p>
        <SubCommandHelp
          title="Theme commands"
          items={THEME_COMMANDS}
          prefix="theme "
          variant="orange"
        />
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan className="gap-1">
      <p className="text-muted-foreground">
        Theme updated to{" "}
        <span className="text-foreground font-semibold">{parsed.mode}</span>.
      </p>
      <p className="text-muted-foreground">
        Active theme:{" "}
        <span className="text-foreground font-semibold">
          {resolvedTheme ?? theme ?? parsed.mode}
        </span>
      </p>
    </AnimatedSpan>
  );
}

export default CTheme;
