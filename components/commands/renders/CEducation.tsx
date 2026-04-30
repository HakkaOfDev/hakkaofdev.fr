"use client";

import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { EDUCATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

function CEducation() {
  const t = useTranslations("CV.education");
  return (
    <AnimatedSpan>
      {EDUCATION.map((education, idx) => {
        const period = t(`${education.slug}.period` as never);
        const name = t(`${education.slug}.name` as never);
        const location = t(`${education.slug}.location` as never);
        const descriptions =
          (t.raw(`${education.slug}.descriptions` as never) as string[]) ?? [];
        const isLast = idx === EDUCATION.length - 1;
        return (
          <div
            key={education.slug}
            className={cn("relative border-l-2 pb-4 pl-4", isLast && "pb-1")}
          >
            <div className="absolute top-1 -left-[5px] z-[1] size-2 rounded-full bg-primary" />
            <p className="text-muted-foreground">{period}</p>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-muted-foreground">{location}</p>
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

export default CEducation;
