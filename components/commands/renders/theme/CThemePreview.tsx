"use client";

import { useEffect } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Shortcut } from "@/components/ui/Shortcut";
import { useThemeEngine } from "@/hooks/useThemeEngine";

const PREVIEW_DURATION_MS = 10_000;

export function CThemePreview({ name }: { name: string }) {
  const { previewTheme, themes, isPreview } = useThemeEngine();

  const aliases: Record<string, string> = {
    dark: "default",
    light: "default",
  };

  const resolvedName = aliases[name] ?? name;
  const target = themes.find((t) => t.name === resolvedName);

  useEffect(() => {
    if (target) previewTheme(target.name, PREVIEW_DURATION_MS);
  }, [target, previewTheme]);

  if (!target) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">
          Unknown theme: <span className="font-semibold">{name}</span>.
        </p>
        <p className="text-muted-foreground">
          Run{" "}
          <Shortcut
            label="theme list"
            command="theme list"
            variant="orange"
            className="px-1.5 py-0 text-[10px]"
          />{" "}
          to see available themes.
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan className="gap-1">
      <p className="text-muted-foreground">
        Previewing{" "}
        <span className="font-semibold text-foreground">{target.label}</span>
        {isPreview && (
          <span className="text-quaternary">
            {" "}
            — auto-reverts in {PREVIEW_DURATION_MS / 1000}s
          </span>
        )}
      </p>
      <div className="mt-1 flex gap-px">
        {(
          [
            "background",
            "foreground",
            "primary",
            "muted",
            "primary",
            "secondary",
            "tertiary",
            "quaternary",
            "quinary",
            "destructive",
          ] as const
        ).map((key) => (
          <span
            key={key}
            className="h-5 w-3 first:rounded-l-sm last:rounded-r-sm"
            style={{ backgroundColor: target.colors[key] }}
            title={`${key}: ${target.colors[key]}`}
          />
        ))}
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground/50">
        Use{" "}
        <span className="font-mono font-semibold text-foreground">
          theme set {target.name}
        </span>{" "}
        to apply permanently.
      </p>
    </AnimatedSpan>
  );
}
