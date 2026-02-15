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
            "border-l-2 pl-4 relative pb-4",
            idx === EXPERIENCES.length - 1 && "pb-1",
          )}
        >
          <div className="absolute -left-[5px] size-2 top-1 rounded-full bg-chart-1 z-[1]" />
          {experience.period.toLowerCase().includes("since") && (
            <div className="absolute -left-[5px] size-2 top-1 animate-ping rounded-full bg-chart-1 opacity-75" />
          )}
          <p className="text-muted-foreground">{experience.period}</p>
          <p className="text-sm font-semibold">{experience.name}</p>
          <p className="text-muted-foreground">
            {experience.company} · {experience.location}
          </p>
          {experience.descriptions && experience.descriptions?.length > 0 && (
            <ul className="list-disc pl-4 mt-2">
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
