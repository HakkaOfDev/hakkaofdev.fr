"use client";

import { useFormatter, useTranslations } from "next-intl";
import {
  AnimatedSpan,
  TimelineTypewriter,
} from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { EDUCATION } from "@/lib/constants";
import { matchesGrep } from "@/lib/utils/grep.utils";
import { formatPeriod } from "@/lib/utils/period.utils";

function CEducation() {
  const t = useTranslations("CV.education");
  const tCommands = useTranslations("Commands");
  const tPeriod = useTranslations("CV.period");
  const format = useFormatter();
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const visible = EDUCATION.filter((education) => {
    if (!grep) return true;
    const period = formatPeriod(education, format, tPeriod);
    const name = t(`${education.slug}.name` as never) as string;
    const location = t(`${education.slug}.location` as never) as string;
    return matchesGrep([period, name, location].join("   "), grep);
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
    <TimelineTypewriter
      entries={visible.map((education) => {
        const period = formatPeriod(education, format, tPeriod);
        const name = t(`${education.slug}.name` as never);
        const location = t(`${education.slug}.location` as never);
        return {
          key: education.slug,
          lines: [
            <p key="period" className="text-muted-foreground">
              {period}
            </p>,
            <p key="name" className="font-semibold text-sm">
              {name}
            </p>,
            <p key="location" className="text-muted-foreground">
              {location}
            </p>,
          ],
        };
      })}
    />
  );
}

export default CEducation;
