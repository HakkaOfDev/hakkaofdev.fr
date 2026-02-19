"use client";

import { useEffect } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Shortcut } from "@/components/ui/Shortcut";
import { useThemeEngine } from "@/hooks/useThemeEngine";

export function CThemeSet({ name }: { name: string }) {
  const { setTheme, themes, palette } = useThemeEngine();

  const aliases: Record<string, string> = {
    dark: "default",
    light: "default",
  };

  const resolvedName = aliases[name] ?? name;
  const target = themes.find((t) => t.name === resolvedName);
  const isValid = !!target;

  useEffect(() => {
    if (isValid) setTheme(resolvedName);
  }, [isValid, resolvedName, setTheme]);

  if (!isValid) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">
          Unknown theme: <span className="font-semibold">{name}</span>.
          Available themes:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {themes.map((t) => (
            <Shortcut
              key={t.name}
              label={t.name}
              command={`theme set ${t.name}`}
              variant="orange"
              className="px-1.5 py-0 text-[10px]"
            />
          ))}
        </div>
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan className="gap-1">
      <p className="text-muted-foreground">
        Theme updated to{" "}
        <span className="font-semibold text-foreground">{target?.label}</span>.
      </p>
      <p className="text-muted-foreground">
        Active theme:{" "}
        <span className="font-semibold text-foreground">{palette.label}</span>{" "}
        <span className="text-muted-foreground/50">
          ({palette.isDark ? "dark" : "light"})
        </span>
      </p>
    </AnimatedSpan>
  );
}
