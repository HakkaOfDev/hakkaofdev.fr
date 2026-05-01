"use client";

import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";

interface ThemeCreateSuccessProps {
  themeName: string;
}

export function ThemeCreateSuccess({ themeName }: ThemeCreateSuccessProps) {
  const t = useTranslations("Theme.create");
  return (
    <AnimatedSpan className="gap-1">
      <p className="text-muted-foreground">
        {t("successMessagePrefix")}{" "}
        <span className="font-semibold text-foreground">{themeName}</span>{" "}
        {t("successMessageSuffix")}
      </p>
      <p className="text-muted-foreground/50 text-xs">{t("successHint")}</p>
    </AnimatedSpan>
  );
}

interface ThemeCreateErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

export function ThemeCreateError({
  errorMessage,
  onRetry,
}: ThemeCreateErrorProps) {
  const t = useTranslations("Theme.create");
  return (
    <AnimatedSpan className="gap-2">
      <p className="text-destructive">{errorMessage}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex w-fit cursor-pointer items-center gap-1 rounded-md bg-primary/10 px-3 py-1 font-semibold text-primary text-xs ring-1 ring-primary/20 ring-inset transition-colors hover:bg-primary/20"
      >
        {t("tryAgain")}
      </button>
    </AnimatedSpan>
  );
}
