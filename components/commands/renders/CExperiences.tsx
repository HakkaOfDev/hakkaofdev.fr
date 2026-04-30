import Link from "next/link";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { EXPERIENCES } from "@/lib/constants";
import { cn } from "@/lib/utils";

function CExperiences() {
  return (
    <AnimatedSpan>
      {EXPERIENCES.map((experience, idx) => (
        <div
          key={experience.name}
          className={cn(
            "relative border-l-2 pb-4 pl-4",
            idx === EXPERIENCES.length - 1 && "pb-1",
          )}
        >
          <div className="absolute top-1 -left-[5px] z-[1] size-2 rounded-full bg-primary" />
          {experience.period.toLowerCase().includes("since") && (
            <div className="absolute top-1 -left-[5px] size-2 animate-ping rounded-full bg-primary opacity-75" />
          )}
          <p className="text-muted-foreground">{experience.period}</p>
          <p className="font-semibold text-sm">{experience.name}</p>
          <p className="text-muted-foreground">
            {experience.companyUrl ? (
              <Link
                href={experience.companyUrl}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:text-primary hover:underline"
              >
                {experience.company}
              </Link>
            ) : (
              experience.company
            )}{" "}
            · {experience.location}
          </p>
          {experience.descriptions && experience.descriptions?.length > 0 && (
            <ul className="mt-2 list-disc pl-4">
              {experience.descriptions?.map((description) => (
                <li key={description}>{description}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </AnimatedSpan>
  );
}

export default CExperiences;
