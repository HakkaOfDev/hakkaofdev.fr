"use client";

import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { EDUCATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { matchesGrep } from "@/lib/utils/grep.utils";

function CEducation() {
  const t = useTranslations("CV.education");
  const tCommands = useTranslations("Commands");
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const visible = EDUCATION.filter((education) => {
    if (!grep) return true;
    const period = t(`${education.slug}.period` as never) as string;
    const name = t(`${education.slug}.name` as never) as string;
    const location = t(`${education.slug}.location` as never) as string;
    const descriptionsKey = `${education.slug}.descriptions` as never;
    const descriptions = (t.raw(descriptionsKey) as string[]) ?? [];
    return matchesGrep(
      [period, name, location, ...descriptions].join("   "),
      grep,
    );
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
    <AnimatedSpan>
      {visible.map((education, idx) => {
        const period = t(`${education.slug}.period` as never);
        const name = t(`${education.slug}.name` as never);
        const location = t(`${education.slug}.location` as never);
        const descriptionsKey = `${education.slug}.descriptions` as never;
        const descriptions = (t.raw(descriptionsKey) as string[]) ?? [];
        const isLast = idx === visible.length - 1;
        return (
          <div
            key={education.slug}
            className={cn("relative border-s-2 ps-4 pb-4", isLast && "pb-1")}
          >
            <div className="absolute -start-[5px] top-1 z-[1] size-2 rounded-full bg-primary" />
            <p className="text-muted-foreground">{period}</p>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-muted-foreground">{location}</p>
            {descriptions.length > 0 && (
              <ul className="mt-2 list-disc ps-4">
                {descriptions.map((description) => (
                  <li key={description}>{description}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </AnimatedSpan>
  );
}

export default CEducation;
