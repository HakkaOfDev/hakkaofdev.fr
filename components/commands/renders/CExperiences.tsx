"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { EXPERIENCES } from "@/lib/constants";
import { cn } from "@/lib/utils";

function CExperiences() {
  const t = useTranslations("CV.experiences");
  return (
    <AnimatedSpan>
      {EXPERIENCES.map((experience, idx) => {
        const period = t(`${experience.slug}.period` as never);
        const name = t(`${experience.slug}.name` as never);
        const company = t(`${experience.slug}.company` as never);
        const location = t(`${experience.slug}.location` as never);
        const descriptions =
          (t.raw(`${experience.slug}.descriptions` as never) as string[]) ??
          [];
        const isLast = idx === EXPERIENCES.length - 1;
        return (
          <div
            key={experience.slug}
            className={cn(
              "relative border-l-2 pb-4 pl-4",
              isLast && "pb-1",
            )}
          >
            <div className="absolute top-1 -left-[5px] z-[1] size-2 rounded-full bg-primary" />
            {period.toLowerCase().includes("since") && (
              <div className="absolute top-1 -left-[5px] size-2 animate-ping rounded-full bg-primary opacity-75" />
            )}
            <p className="text-muted-foreground">{period}</p>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-muted-foreground">
              {experience.companyUrl ? (
                <Link
                  href={experience.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:text-primary hover:underline"
                >
                  {company}
                </Link>
              ) : (
                company
              )}{" "}
              · {location}
            </p>
            {descriptions.length > 0 && (
              <ul className="mt-2 list-disc pl-4">
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

export default CExperiences;
