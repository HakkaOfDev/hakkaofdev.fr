import { AnimatedSpan } from "@/components/AnimatedComponents";
import { SKILLS } from "@/lib/constants";

function CSkills() {
  return (
    <AnimatedSpan className="gap-3">
      {Object.entries(SKILLS).map(([key, value]) => (
        <div key={key}>
          <p className="text-sm font-semibold">{key}</p>
          <p className="text-muted-foreground">{value.join(", ")}</p>
        </div>
      ))}
    </AnimatedSpan>
  );
}

export default CSkills;
