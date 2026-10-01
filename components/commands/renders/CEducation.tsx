"use client";

import { useFormatter, useTranslations } from "next-intl";
import { AnimatedSpan, TypeStep } from "@/components/AnimatedComponents";
import {
  TimelineCard,
  useTimelineCardsTyping,
} from "@/components/commands/renders/TimelineCard";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { EDUCATION } from "@/lib/constants";
import { filterByGrep } from "@/lib/utils/grep.utils";
import { formatPeriod, formatPeriodParts } from "@/lib/utils/period.utils";

const EDUCATION_BODY_STEPS = 2;

function CEducation() {
  const t = useTranslations("CV.education");
  const tCommands = useTranslations("Commands");
  const tPeriod = useTranslations("CV.period");
  const format = useFormatter();
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const entries = EDUCATION.map((education) => ({
    education,
    period: formatPeriod(education, format, tPeriod),
    ...formatPeriodParts(education, format, tPeriod),
    name: t(`${education.slug}.name` as never) as string,
    location: t(`${education.slug}.location` as never) as string,
  }));
  const visible = filterByGrep(entries, grep, (entry) => [
    entry.period,
    entry.name,
    entry.location,
  ]);
  const typing = useTimelineCardsTyping(
    visible.map(() => EDUCATION_BODY_STEPS),
  );

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
    <AnimatedSpan>
      {visible.map((entry, index) => (
        <TimelineCard
          key={entry.education.slug}
          range={entry.range}
          duration={entry.duration}
          ongoing={!entry.education.end}
          isLast={index === visible.length - 1}
          typing={typing[index]}
        >
          {(step) => (
            <>
              <TypeStep as="p" className="font-semibold text-sm" {...step(0)}>
                {entry.name}
              </TypeStep>
              <TypeStep as="p" className="text-muted-foreground" {...step(1)}>
                {entry.location}
              </TypeStep>
            </>
          )}
        </TimelineCard>
      ))}
    </AnimatedSpan>
  );
}

export default CEducation;
