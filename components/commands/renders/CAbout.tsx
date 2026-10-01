"use client";

import { m, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  AnimatedSpan,
  type TypedProgress,
  TypeStep,
  typedStep,
  useTypedGroups,
} from "@/components/AnimatedComponents";
import { LANGUAGE_FLAGS } from "@/components/icons/flags";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { Tag } from "@/components/ui/Tag";
import { revealItemVariants } from "@/lib/animation/motion";
import { HOBBIES, LANGUAGES, SITE } from "@/lib/constants";
import { filterByGrep } from "@/lib/utils/grep.utils";

const BIRTH_DATE = new Date("2002-12-24");
const LABEL_STEPS = 1;

type ProfileRow = {
  key: string;
  searchText: string[];
  steps: number;
  render: (progress: TypedProgress) => ReactNode;
};

function RowLabel({
  progress,
  children,
}: {
  progress: TypedProgress;
  children: ReactNode;
}) {
  return (
    <TypeStep className="text-muted-foreground" {...typedStep(progress, 0)}>
      {children}
    </TypeStep>
  );
}

function TypedTags({
  progress,
  items,
  grep,
}: {
  progress: TypedProgress;
  items: Array<{ key: string; label: string; icon?: ReactNode }>;
  grep: string;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item, index) => (
        <TypeStep
          key={item.key}
          as="span"
          className="inline-flex items-center"
          {...typedStep(progress, LABEL_STEPS + index)}
        >
          <Tag
            icon={item.icon}
            label={item.label}
            variant={
              grep && item.label.toLowerCase().includes(grep)
                ? "teal"
                : "default"
            }
          />
        </TypeStep>
      ))}
    </div>
  );
}

function CAbout() {
  const t = useTranslations("Commands.about");
  const tCommands = useTranslations("Commands");
  const tCv = useTranslations("CV");
  const tMeta = useTranslations("Metadata");
  const tHobbies = useTranslations("CV.hobbies");
  const tLanguages = useTranslations("CV.spokenLanguages");
  const tLevels = useTranslations("CV.languageLevels");
  const prefersReduced = useReducedMotion();
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const ageYears = Math.floor(
    (Date.now() - BIRTH_DATE.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  );
  const headline = tCv("headline");
  const location = tMeta("location");
  const age = t("yearsOld", { years: ageYears });

  const languages = LANGUAGES.map((language) => {
    const Flag = LANGUAGE_FLAGS[language.code];
    return {
      key: language.code,
      icon: Flag ? <Flag /> : null,
      label: `${tLanguages(language.code as never)} · ${tLevels(language.levelSlug as never)}`,
    };
  });
  const hobbies = HOBBIES.map((slug) => ({
    key: slug,
    label: tHobbies(slug as never) as string,
  }));

  const rows: ProfileRow[] = [
    {
      key: "identity",
      searchText: [SITE.name, headline, location, age],
      steps: 2,
      render: (progress) => (
        <div className="grid gap-0.5">
          <TypeStep
            as="p"
            className="font-semibold text-foreground text-sm"
            {...typedStep(progress, 0)}
          >
            {SITE.name}
          </TypeStep>
          <TypeStep
            as="p"
            className="text-muted-foreground"
            {...typedStep(progress, 1)}
          >
            {headline} · {location} · {age}
          </TypeStep>
        </div>
      ),
    },
    {
      key: "email",
      searchText: [t("email"), SITE.email],
      steps: 2,
      render: (progress) => (
        <>
          <RowLabel progress={progress}>{t("email")}</RowLabel>
          <TypeStep {...typedStep(progress, LABEL_STEPS)}>
            <Link
              href={`mailto:${SITE.email}`}
              className="font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
            >
              {SITE.email}
            </Link>
          </TypeStep>
        </>
      ),
    },
    {
      key: "languages",
      searchText: [t("languages"), ...languages.map((item) => item.label)],
      steps: LABEL_STEPS + languages.length,
      render: (progress) => (
        <>
          <RowLabel progress={progress}>{t("languages")}</RowLabel>
          <TypedTags progress={progress} items={languages} grep={grep} />
        </>
      ),
    },
    {
      key: "hobbies",
      searchText: [t("hobbies"), ...hobbies.map((item) => item.label)],
      steps: LABEL_STEPS + hobbies.length,
      render: (progress) => (
        <>
          <RowLabel progress={progress}>{t("hobbies")}</RowLabel>
          <TypedTags progress={progress} items={hobbies} grep={grep} />
        </>
      ),
    },
  ];

  const visible = filterByGrep(rows, grep, (row) => row.searchText);
  const progress = useTypedGroups(visible.map((row) => row.steps));

  if (grep && visible.length === 0) {
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
      <m.section
        className="grid gap-3 rounded-lg border border-border/60 @md:p-3 p-2.5 dark:border-overlay-medium"
        variants={revealItemVariants}
        initial={prefersReduced ? false : "hidden"}
        animate="visible"
      >
        {visible.map((row, index) =>
          row.key === "identity" ? (
            <div
              key={row.key}
              className="border-border/50 border-b pb-3 last:border-b-0 last:pb-0 dark:border-overlay-medium"
            >
              {row.render(progress[index])}
            </div>
          ) : (
            <div
              key={row.key}
              className="grid @md:grid-cols-[7rem_minmax(0,1fr)] @md:items-baseline @md:gap-3 gap-1"
            >
              {row.render(progress[index])}
            </div>
          ),
        )}
      </m.section>
    </AnimatedSpan>
  );
}

export default CAbout;
