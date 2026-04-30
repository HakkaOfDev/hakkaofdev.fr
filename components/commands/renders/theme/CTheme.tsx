"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import {
  THEME_COMMAND_RENDERERS,
  THEME_COMMANDS,
} from "@/components/commands/registries/theme.registry";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import SubCommandHelp from "../SubCommandHelp";

function CTheme({ input }: { input: string }) {
  const t = useTranslations("Theme");
  const { palette } = useThemeEngine();

  const parsed = useMemo(() => {
    const parts = input.trim().split(/\s+/).filter(Boolean);
    return {
      subcommand: parts[1] as string | undefined,
      arg: parts[2] as string | undefined,
      hasExtraArgs: parts.length > 3,
    };
  }, [input]);

  if (!parsed.subcommand) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-muted-foreground">
          {t("currentLabel")}{" "}
          <span className="font-semibold text-foreground">{palette.label}</span>{" "}
          <span className="text-muted-foreground/50">
            ({palette.isDark ? t("darkSuffix") : t("lightSuffix")})
          </span>
        </p>
        <p className="mb-2 text-muted-foreground">
          {t("usagePrefix")}{" "}
          <span className="font-semibold text-foreground">
            theme {THEME_COMMANDS.map((c) => c.command).join(" | theme ")}
          </span>
        </p>
        <SubCommandHelp
          title={t("themeCommandsTitle")}
          items={THEME_COMMANDS}
          prefix="theme "
          variant="orange"
        />
      </AnimatedSpan>
    );
  }

  const { subcommand, arg, hasExtraArgs } = parsed;

  // Backwards compatibility: `theme dark`, `theme light`
  const legacyAliases = new Set(["dark", "light"]);
  if (legacyAliases.has(subcommand) && !arg) {
    return THEME_COMMAND_RENDERERS.set(subcommand);
  }

  const validCommands = THEME_COMMANDS.map((c) => c.command);

  switch (subcommand) {
    case "list":
      if (arg) {
        return (
          <AnimatedSpan>
            <p className="text-destructive">
              {t("noArgs", { command: "theme list" })}
            </p>
          </AnimatedSpan>
        );
      }
      return THEME_COMMAND_RENDERERS.list();

    case "set":
      if (!arg || hasExtraArgs) {
        return (
          <AnimatedSpan className="gap-1">
            <p className="text-destructive">
              {!arg ? t("missingName") : t("tooManyArgs")}
            </p>
            <p className="text-muted-foreground">
              {t("usagePrefix")}{" "}
              <span className="font-semibold text-foreground">
                theme set &lt;name&gt;
              </span>
            </p>
          </AnimatedSpan>
        );
      }
      return THEME_COMMAND_RENDERERS.set(arg);

    case "preview":
      if (!arg || hasExtraArgs) {
        return (
          <AnimatedSpan className="gap-1">
            <p className="text-destructive">
              {!arg ? t("missingName") : t("tooManyArgs")}
            </p>
            <p className="text-muted-foreground">
              {t("usagePrefix")}{" "}
              <span className="font-semibold text-foreground">
                theme preview &lt;name&gt;
              </span>
            </p>
          </AnimatedSpan>
        );
      }
      return THEME_COMMAND_RENDERERS.preview(arg);

    case "create":
      return THEME_COMMAND_RENDERERS.create();

    case "validate":
      if (arg) {
        return (
          <AnimatedSpan>
            <p className="text-destructive">
              {t("noArgs", { command: "theme validate" })}
            </p>
          </AnimatedSpan>
        );
      }
      return THEME_COMMAND_RENDERERS.validate();

    default:
      return (
        <AnimatedSpan className="gap-2">
          <p className="text-destructive">
            {t("unknownSubcommand", {
              sub: subcommand,
              commands: validCommands.join(", "),
            })}
          </p>
          <SubCommandHelp
            title={t("themeCommandsTitle")}
            items={THEME_COMMANDS}
            prefix="theme "
            variant="orange"
          />
        </AnimatedSpan>
      );
  }
}

export default CTheme;
