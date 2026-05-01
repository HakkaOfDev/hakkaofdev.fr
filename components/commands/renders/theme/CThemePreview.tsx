"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Shortcut } from "@/components/ui/Shortcut";
import { useThemeEngine } from "@/hooks/useThemeEngine";

const PREVIEW_DURATION_MS = 10_000;

export function CThemePreview({ name }: { name: string }) {
  const t = useTranslations("Theme.preview");
  const { previewTheme, themes, isPreview } = useThemeEngine();

  const aliases: Record<string, string> = {
    dark: "default",
    light: "default",
  };

  const resolvedName = aliases[name] ?? name;
  const target = themes.find((th) => th.name === resolvedName);

  useEffect(() => {
    if (target) previewTheme(target.name, PREVIEW_DURATION_MS);
  }, [target, previewTheme]);

  if (!target) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">{t("unknown", { name })}</p>
        <p className="text-muted-foreground">
          {t.rich("runListHint", {
            link: () => (
              <Shortcut
                label="theme list"
                command="theme list"
                variant="orange"
                className="px-1.5 py-0 text-xs"
              />
            ),
          })}
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan className="gap-1">
      <p className="text-muted-foreground">
        {t("previewing", { label: target.label })}
        {isPreview && (
          <span className="text-quaternary">
            {" "}
            {t("autoReverts", { seconds: PREVIEW_DURATION_MS / 1000 })}
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
      <p className="mt-1 text-muted-foreground/50 text-xs">
        {t("applyHintPrefix")}{" "}
        <span className="font-mono font-semibold text-foreground">
          theme set {target.name}
        </span>{" "}
        {t("applyHintSuffix")}
      </p>
    </AnimatedSpan>
  );
}
