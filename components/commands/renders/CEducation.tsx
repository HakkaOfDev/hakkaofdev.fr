import { AnimatedSpan } from "@/components/AnimatedComponents";
import { EDUCATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

function CEducation() {
  return (
    <AnimatedSpan>
      {EDUCATION.map((education, idx) => (
        <div
          key={education.name}
          className={cn(
            "relative border-l-2 pb-4 pl-4",
            idx === EDUCATION.length - 1 && "pb-1",
          )}
        >
          <div className="absolute top-1 -left-[5px] z-[1] size-2 rounded-full bg-primary" />
          <p className="text-muted-foreground">{education.period}</p>
          <p className="font-semibold text-sm">{education.name}</p>
          <p className="text-muted-foreground">{education.location}</p>
          {education.descriptions && education.descriptions?.length > 0 && (
            <ul className="mt-2 list-disc pl-4">
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
