"use client";

import { useTranslations } from "next-intl";
import { AnimatedSpan, TypeLines } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { SKILLS } from "@/lib/constants";

function CSkills() {
  const t = useTranslations("CV.skillGroups");
  const tCommands = useTranslations("Commands");
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const groups = SKILLS.map((group) => {
    const groupLabel = t(group.slug as never) as string;
    const values = grep
      ? group.values.filter((v) => v.toLowerCase().includes(grep))
      : group.values;
    const groupMatches = grep ? groupLabel.toLowerCase().includes(grep) : false;
    // Show the group if either its label matches (then keep all values) or any of its values match.
    return {
      slug: group.slug,
      label: groupLabel,
      values: groupMatches ? group.values : values,
      visible: !grep || groupMatches || values.length > 0,
    };
  }).filter((g) => g.visible);

  if (grep && groups.length === 0) {
    return (
      <AnimatedSpan>
        <p className="text-muted-foreground text-xs">
          {tCommands("noMatches", { pattern: grepRaw })}
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <TypeLines
      className="gap-3"
      lines={groups.map((group) => (
        <div key={group.slug}>
          <p className="font-semibold text-sm">{group.label}</p>
          <p className="text-muted-foreground">{group.values.join(", ")}</p>
        </div>
      ))}
    />
  );
}

export default CSkills;
