"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { LANG_COMMANDS } from "@/components/commands/registries/lang.registry";
import { Shortcut } from "@/components/ui/Shortcut";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import SubCommandHelp from "./SubCommandHelp";

function isLocale(code: string): code is Locale {
  return (routing.locales as readonly string[]).includes(code);
}

function clearLocaleCookie() {
  if (typeof document === "undefined") return;
  document.cookie =
    "NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

function CLang({ input }: { input: string }) {
  const t = useTranslations("Lang");
  const tNames = useTranslations("Lang.names");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const parsed = useMemo(() => {
    const parts = input.trim().split(/\s+/).filter(Boolean);
    return {
      sub: parts[1],
      arg: parts[2],
      hasExtra: parts.length > 3,
    };
  }, [input]);

  const setOk =
    parsed.sub === "set" &&
    parsed.arg !== undefined &&
    isLocale(parsed.arg) &&
    !parsed.hasExtra;

  // biome-ignore lint/correctness/useExhaustiveDependencies: setOk implies parsed.arg is set
  useEffect(() => {
    if (setOk && parsed.arg) {
      router.replace(pathname, { locale: parsed.arg as Locale });
    }
  }, [setOk, parsed.arg, router, pathname]);

  useEffect(() => {
    if (parsed.sub === "auto" && !parsed.arg && !parsed.hasExtra) {
      clearLocaleCookie();
    }
  }, [parsed.sub, parsed.arg, parsed.hasExtra]);

  if (!parsed.sub) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-muted-foreground">
          {t("currentLabel")}{" "}
          <span className="font-semibold text-foreground">
            {tNames(locale as never)} ({locale})
          </span>
        </p>
        <p className="text-muted-foreground">
          {t("availablePrefix")}{" "}
          {routing.locales.map((code, idx) => (
            <span key={code}>
              <span className="font-mono text-foreground">{code}</span>
              {idx < routing.locales.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
        <p className="mb-2 text-muted-foreground">
          {t("usagePrefix")}{" "}
          <span className="font-semibold text-foreground">
            lang set | lang auto
          </span>
        </p>
        <SubCommandHelp
          title={t("subCommandsTitle")}
          items={LANG_COMMANDS}
          prefix="lang "
          variant="default"
        />
      </AnimatedSpan>
    );
  }

  if (parsed.sub === "set") {
    if (!parsed.arg || parsed.hasExtra) {
      return (
        <AnimatedSpan className="gap-1">
          <p className="text-destructive">
            {!parsed.arg ? t("missingCode") : t("tooManyArgs")}
          </p>
          <p className="text-muted-foreground">
            {t("usagePrefix")}{" "}
            <span className="font-semibold text-foreground">
              lang set &lt;code&gt;
            </span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {routing.locales.map((code) => (
              <Shortcut
                key={code}
                label={code}
                command={`lang set ${code}`}
                className="px-1.5 py-0 text-xs"
              />
            ))}
          </div>
        </AnimatedSpan>
      );
    }

    if (!isLocale(parsed.arg)) {
      return (
        <AnimatedSpan className="gap-1">
          <p className="text-destructive">
            {t("unknownLocale", { code: parsed.arg })}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {routing.locales.map((code) => (
              <Shortcut
                key={code}
                label={code}
                command={`lang set ${code}`}
                className="px-1.5 py-0 text-xs"
              />
            ))}
          </div>
        </AnimatedSpan>
      );
    }

    return (
      <AnimatedSpan>
        <p className="text-muted-foreground">
          {t("switching", { locale: tNames(parsed.arg as never) })}
        </p>
      </AnimatedSpan>
    );
  }

  if (parsed.sub === "auto") {
    return (
      <AnimatedSpan>
        <p className="text-muted-foreground">{t("autoCleared")}</p>
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan className="gap-2">
      <p className="text-destructive">
        {t("unknownSubcommand", { sub: parsed.sub })}
      </p>
      <SubCommandHelp
        title={t("subCommandsTitle")}
        items={LANG_COMMANDS}
        prefix="lang "
        variant="default"
      />
    </AnimatedSpan>
  );
}

export default CLang;
