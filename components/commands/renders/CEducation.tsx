import { AnimatedSpan } from "@/components/Terminal";
import { EDUCATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import React from "react";

function CEducation() {
  return (
    <AnimatedSpan>
      {EDUCATION.map((education, idx) => (
        <div
          key={education.name}
          className={cn(
            "border-l-2 pl-4 relative pb-4",
            idx === EDUCATION.length - 1 && "pb-1"
          )}
        >
          <div className="absolute -left-[5px] size-2 top-1 rounded-full bg-chart-2 z-[1]" />
          <p className="text-muted-foreground">{education.period}</p>
          <p className="text-sm font-semibold">{education.name}</p>
          <p className="text-muted-foreground">{education.location}</p>
          {education.descriptions && education.descriptions?.length > 0 && (
            <ul className="list-disc pl-4 mt-2">
              {education.descriptions?.map((description) => (
                <li key={description}>{description}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </AnimatedSpan>
  );
}

export default CEducation;
