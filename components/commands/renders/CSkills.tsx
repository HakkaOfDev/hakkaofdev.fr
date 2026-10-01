"use client";

import { m, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  AnimatedSpan,
  type TypedProgress,
  TypeStep,
  typedStep,
  useTypedGroups,
} from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { Tag } from "@/components/ui/Tag";
import { revealItemVariants } from "@/lib/animation/motion";
import { SKILLS } from "@/lib/constants";
import { SOFT_SKILLS_SLUG } from "@/lib/constants/skills.constants";
import { cn } from "@/lib/utils";

type VisibleSkillGroup = {
  slug: string;
  label: string;
  values: string[];
};

const LABEL_STEPS = 1;

function SkillGroupCard({
  group,
  grep,
  progress,
}: {
  group: VisibleSkillGroup;
  grep: string;
  progress: TypedProgress;
}) {
  const prefersReduced = useReducedMotion();
  if (progress.typed === 0) return null;

  return (
    <m.section
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border/60 @md:p-3 p-2.5 dark:border-overlay-medium",
        group.slug === SOFT_SKILLS_SLUG && "@md:col-span-2",
      )}
      variants={revealItemVariants}
      initial={prefersReduced ? false : "hidden"}
      animate="visible"
    >
      <TypeStep
        as="p"
        className="font-semibold text-foreground"
        {...typedStep(progress, 0)}
      >
        {group.label}
      </TypeStep>
      <div className="flex flex-wrap gap-1">
        {group.values.map((value, index) => (
          <TypeStep
            key={value}
            as="span"
            className="inline-flex items-center"
            {...typedStep(progress, LABEL_STEPS + index)}
          >
            <Tag
              label={value}
              variant={
                grep && value.toLowerCase().includes(grep) ? "teal" : "default"
              }
            />
          </TypeStep>
        ))}
      </div>
    </m.section>
  );
}

function CSkills() {
  const t = useTranslations("CV.skillGroups");
  const tCommands = useTranslations("Commands");
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const groups: VisibleSkillGroup[] = SKILLS.map((group) => {
    const label = t(group.slug as never) as string;
    const matchingValues = group.values.filter((value) =>
      value.toLowerCase().includes(grep),
    );
    const labelMatches = grep !== "" && label.toLowerCase().includes(grep);
    return {
      slug: group.slug,
      label,
      values: labelMatches ? group.values : matchingValues,
    };
  }).filter((group) => group.values.length > 0);

  const progress = useTypedGroups(
    groups.map((group) => LABEL_STEPS + group.values.length),
  );

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
    <AnimatedSpan className="@container">
      <div className="grid @md:grid-cols-2 gap-2">
        {groups.map((group, index) => (
          <SkillGroupCard
            key={group.slug}
            group={group}
            grep={grep}
            progress={progress[index]}
          />
        ))}
      </div>
    </AnimatedSpan>
  );
}

export default CSkills;
