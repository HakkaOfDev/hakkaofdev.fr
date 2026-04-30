"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Shortcut } from "@/components/ui/Shortcut";
import { useThemeEngine } from "@/hooks/useThemeEngine";

export function CThemeSet({ name }: { name: string }) {
  const t = useTranslations("Theme");
  const { setTheme, themes, palette } = useThemeEngine();

  const aliases: Record<string, string> = {
    dark: "default",
    light: "default",
  };

  const resolvedName = aliases[name] ?? name;
  const target = themes.find((th) => th.name === resolvedName);
  const isValid = !!target;

  useEffect(() => {
    if (isValid) setTheme(resolvedName);
  }, [isValid, resolvedName, setTheme]);

  if (!isValid) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">{t("set.unknownAvailable", { name })}</p>
        <div className="flex flex-wrap gap-1.5">
          {themes.map((th) => (
            <Shortcut
              key={th.name}
              label={th.name}
              command={`theme set ${th.name}`}
              variant="orange"
              className="px-1.5 py-0 text-xs"
            />
          ))}
        </div>
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan className="gap-1">
      <p className="text-muted-foreground">
        {t("set.updated", { label: target?.label ?? "" })}
      </p>
      <p className="text-muted-foreground">
        {t("set.active", {
          label: palette.label,
          mode: palette.isDark ? t("darkSuffix") : t("lightSuffix"),
        })}
      </p>
    </AnimatedSpan>
  );
}
