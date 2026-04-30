"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import type { ShortcutProps } from "@/components/ui/Shortcut";
import SubCommandHelp from "./SubCommandHelp";

type SubCommandItem = {
  command: string;
  slug: string;
};

type SubCommandRouterProps = {
  input: string;
  commands: SubCommandItem[];
  prefix: string;
  title: string;
  variant: ShortcutProps["variant"];
  subcommandLabel?: string;
  status?: ReactNode;
  onValidEffect?: (subcommand: string) => void;
  renderValid: (subcommand: string) => ReactNode;
};

export default function SubCommandRouter({
  input,
  commands,
  prefix,
  title,
  variant,
  subcommandLabel,
  status,
  onValidEffect,
  renderValid,
}: SubCommandRouterProps) {
  const t = useTranslations("Commands.subCommandRouter");
  const validNames = useMemo(() => commands.map((c) => c.command), [commands]);

  const validSet = useMemo(() => new Set<string>(validNames), [validNames]);

  const parsed = useMemo(() => {
    const parts = input.trim().split(/\s+/).filter(Boolean);
    return {
      subcommand: parts[1] as string | undefined,
      hasExtraArgs: parts.length > 2,
    };
  }, [input]);

  const isValid = Boolean(parsed.subcommand && validSet.has(parsed.subcommand));

  useEffect(() => {
    if (!parsed.subcommand || !isValid || parsed.hasExtraArgs) return;
    onValidEffect?.(parsed.subcommand);
  }, [parsed.subcommand, parsed.hasExtraArgs, isValid, onValidEffect]);

  if (!parsed.subcommand) {
    return (
      <AnimatedSpan className="gap-2">
        {status}
        <p className="mb-2 text-muted-foreground">
          {t("usagePrefix")}{" "}
          <span className="font-semibold text-foreground">
            {prefix} {validNames.join(` | ${prefix} `)}
          </span>
        </p>
        <SubCommandHelp
          title={title}
          items={commands}
          prefix={`${prefix} `}
          variant={variant}
        />
      </AnimatedSpan>
    );
  }

  if (!isValid || parsed.hasExtraArgs) {
    const label = subcommandLabel ?? t("subcommand");
    const invalidReason = parsed.hasExtraArgs
      ? t("tooManyArgs")
      : t("unknown", { label, sub: parsed.subcommand });

    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">
          {invalidReason} {t("useOneOf", { options: validNames.join(", ") })}
        </p>
        <p className="mb-2 text-muted-foreground">
          {t("examplePrefix")}{" "}
          <span className="font-semibold text-foreground">
            {prefix} {validNames[0]}
          </span>
        </p>
        <SubCommandHelp
          title={title}
          items={commands}
          prefix={`${prefix} `}
          variant={variant}
        />
      </AnimatedSpan>
    );
  }

  return <>{renderValid(parsed.subcommand)}</>;
}
