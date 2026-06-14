"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { AnimatedSpan, RevealGroup } from "@/components/AnimatedComponents";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import { type ContrastResult, validatePalette } from "@/lib/themes/contrast";

interface ValidationHeaderProps {
  paletteName: string;
}

function ValidationHeader({ paletteName }: ValidationHeaderProps) {
  const t = useTranslations("Theme.validate");
  return (
    <p className="text-muted-foreground">
      {t.rich("header", {
        name: () => (
          <span className="font-semibold text-foreground">{paletteName}</span>
        ),
      })}
    </p>
  );
}

interface ValidationSummaryProps {
  passCount: number;
  failCount: number;
  totalChecked: number;
  hasNonOklch: boolean;
}

function ValidationSummary({
  passCount,
  failCount,
  totalChecked,
  hasNonOklch,
}: ValidationSummaryProps) {
  const t = useTranslations("Theme.validate");
  return (
    <div className="flex items-center gap-3">
      <span className="font-semibold text-secondary text-xs">
        {t("passCount", { count: passCount })}
      </span>
      {failCount > 0 && (
        <span className="font-semibold text-destructive text-xs">
          {t("failCount", { count: failCount })}
        </span>
      )}
      <span className="text-muted-foreground/50 text-xs">
        {t("totalChecked", { count: totalChecked })}
      </span>
      {hasNonOklch && (
        <span className="text-muted-foreground/50 text-xs">
          {t("skippedWarning")}
        </span>
      )}
    </div>
  );
}

interface ValidationResultRowProps {
  result: ContrastResult;
}

function ValidationResultRow({ result }: ValidationResultRowProps) {
  const t = useTranslations("Theme.validate.pairs");
  const { passes, pair, ratio } = result;
  const requiredRatio = pair.level === "normal" ? "≥ 4.5" : "≥ 3.0";

  return (
    <div className="grid grid-cols-[16px_1fr_80px_60px] items-center gap-2 font-mono text-xs">
      <span>{passes ? "✓" : "✗"}</span>
      <span className={passes ? "text-muted-foreground" : "text-destructive"}>
        {t(pair.slug as never)}
      </span>
      <span className="text-right text-muted-foreground/60">
        {ratio.toFixed(2)}:1
      </span>
      <span className="text-right text-muted-foreground/40">
        {requiredRatio}
      </span>
    </div>
  );
}

interface ValidationDetailsTableProps {
  results: ContrastResult[];
}

function ValidationDetailsTable({ results }: ValidationDetailsTableProps) {
  return (
    <RevealGroup className="terminal-scrollbar grid max-h-48 gap-1 overflow-y-auto pr-1">
      {results.map((result) => (
        <ValidationResultRow key={result.pair.slug} result={result} />
      ))}
    </RevealGroup>
  );
}

interface ValidationFooterProps {
  failureCount: number;
}

function ValidationFooter({ failureCount }: ValidationFooterProps) {
  const t = useTranslations("Theme.validate");
  if (failureCount === 0) {
    return (
      <p className="font-semibold text-secondary text-xs">{t("allPass")}</p>
    );
  }

  return (
    <p className="text-destructive text-xs">
      {t("someFail", { count: failureCount })}
    </p>
  );
}

export function CThemeValidate() {
  const { palette } = useThemeEngine();

  const results = useMemo(() => validatePalette(palette), [palette]);
  const passes = results.filter((r) => r.passes);
  const failures = results.filter((r) => !r.passes);
  const hasNonOklch = results.length < 10;

  return (
    <AnimatedSpan className="gap-3">
      <ValidationHeader paletteName={palette.label} />
      <ValidationSummary
        passCount={passes.length}
        failCount={failures.length}
        totalChecked={results.length}
        hasNonOklch={hasNonOklch}
      />
      <ValidationDetailsTable results={results} />
      <ValidationFooter failureCount={failures.length} />
    </AnimatedSpan>
  );
}
