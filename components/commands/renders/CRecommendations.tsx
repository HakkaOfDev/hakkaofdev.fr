"use client";

import { Briefcase, Download, Play, Quote } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { EXPERIENCES, RECOMMENDATIONS } from "@/lib/constants";
import { matchesGrep } from "@/lib/utils/grep.utils";

const EXPERIENCE_BY_SLUG = new Map(EXPERIENCES.map((e) => [e.slug, e]));

function CRecommendations() {
  const t = useTranslations("Commands.recommendations");
  const tCommands = useTranslations("Commands");
  const tExp = useTranslations("CV.experiences");
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const visible = RECOMMENDATIONS.filter((rec) => {
    if (!grep) return true;
    const company = tExp(`${rec.experienceSlug}.company` as never) as string;
    const role = tExp(`${rec.experienceSlug}.name` as never) as string;
    const haystack = [
      rec.recommender.name,
      rec.recommender.role,
      rec.recommender.company,
      rec.quote,
      company,
      role,
    ].join("   ");
    return matchesGrep(haystack, grep);
  });

  if (grep && visible.length === 0) {
    return (
      <AnimatedSpan>
        <p className="text-muted-foreground text-xs">
          {tCommands("noMatches", { pattern: grepRaw })}
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan className="gap-4">
      {visible.map((rec) => {
        const experience = EXPERIENCE_BY_SLUG.get(rec.experienceSlug);
        const company = tExp(`${rec.experienceSlug}.company` as never);
        const role = tExp(`${rec.experienceSlug}.name` as never);
        const period = tExp(`${rec.experienceSlug}.period` as never);
        const pdfUrl = `/recommendations/${rec.file}`;

        return (
          <div
            key={rec.experienceSlug}
            className="overflow-hidden rounded-lg border border-border/60 bg-overlay-subtle/30 dark:border-overlay-medium dark:bg-overlay-subtle/40"
          >
            {/* ── Quote ── */}
            <div className="flex gap-2.5 px-4 pt-4">
              <Quote className="h-4 w-4 shrink-0 text-primary/70" />
              <p className="text-pretty text-foreground/90 text-sm italic leading-relaxed">
                {rec.quote}
              </p>
            </div>

            {/* ── Recommender + bound experience ── */}
            <div className="flex flex-wrap items-end justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-semibold text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                  {t("recommendedBy")}
                </p>
                <p className="font-semibold text-sm">{rec.recommender.name}</p>
                <p className="text-muted-foreground text-xs">
                  {rec.recommender.role} ·{" "}
                  {rec.recommender.url ? (
                    <Link
                      href={rec.recommender.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline-offset-2 hover:text-primary hover:underline"
                    >
                      {rec.recommender.company}
                    </Link>
                  ) : (
                    rec.recommender.company
                  )}
                </p>
              </div>

              <div className="flex flex-col items-end gap-0.5 text-end">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-primary text-xs ring-1 ring-primary/20 ring-inset">
                  <Briefcase className="h-3 w-3 shrink-0" />
                  {experience?.companyUrl ? (
                    <Link
                      href={experience.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold hover:underline"
                    >
                      {company}
                    </Link>
                  ) : (
                    <span className="font-semibold">{company}</span>
                  )}
                  <span className="text-primary/70">· {role}</span>
                </span>
                <span className="text-[10px] text-muted-foreground/70">
                  {period}
                </span>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-wrap gap-2 border-border/50 border-t px-4 py-2.5 dark:border-overlay-medium">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-1 font-semibold text-secondary text-xs ring-1 ring-secondary/20 ring-inset transition-colors duration-200 hover:bg-secondary/20"
              >
                <Play className="h-3.5 w-3.5" />
                {t("readLetter")}
              </a>
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 font-semibold text-primary text-xs ring-1 ring-primary/20 ring-inset transition-colors duration-200 hover:bg-primary/20"
              >
                <Download className="h-3.5 w-3.5" />
                {t("download")}
              </a>
            </div>
          </div>
        );
      })}
    </AnimatedSpan>
  );
}

export default CRecommendations;
