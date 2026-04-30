"use client";

import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { SKILLS } from "@/lib/constants";

function CSkills() {
  const t = useTranslations("CV.skillGroups");
  return (
    <AnimatedSpan className="gap-3">
      {SKILLS.map((group) => (
        <div key={group.slug}>
          <p className="font-semibold text-sm">{t(group.slug as never)}</p>
          <p className="text-muted-foreground">{group.values.join(", ")}</p>
        </div>
      ))}
    </AnimatedSpan>
  );
}

export default CSkills;
