"use client";

import { ArrowUpRight, FolderOpen, Play, Quote, Wrench } from "lucide-react";
import { m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import {
  AnimatedSpan,
  AutoHeight,
  TypeStep,
} from "@/components/AnimatedComponents";
import {
  DetailBullets,
  DetailDialog,
  DetailSection,
} from "@/components/commands/renders/DetailDialog";
import {
  TimelineCard,
  type TypedStep,
  useTimelineCardsTyping,
} from "@/components/commands/renders/TimelineCard";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { DURATION, EASE_OUT } from "@/lib/animation/motion";
import { EXPERIENCES, PROJECTS, RECOMMENDATIONS } from "@/lib/constants";
import type { ProjectEntry } from "@/lib/constants/projects.constants";
import type {
  ExperienceEntry,
  RecommendationEntry,
} from "@/lib/constants/resume.constants";
import { cn } from "@/lib/utils";
import { filterByGrep } from "@/lib/utils/grep.utils";
import { formatPeriod, formatPeriodParts } from "@/lib/utils/period.utils";

type RelatedProject = {
  project: ProjectEntry;
  name: string;
  description: string;
};

type ExperienceDetails = {
  experience: ExperienceEntry;
  period: string;
  range: string;
  duration: string | null;
  name: string;
  company: string;
  location: string;
  highlights: string[];
  projects: RelatedProject[];
  recommendations: RecommendationEntry[];
};

function useExperienceDetails(): (
  experience: ExperienceEntry,
) => ExperienceDetails {
  const t = useTranslations("CV.experiences");
  const tProjects = useTranslations("CV.projects");
  const tPeriod = useTranslations("CV.period");
  const format = useFormatter();

  return (experience) => ({
    experience,
    period: formatPeriod(experience, format, tPeriod),
    ...formatPeriodParts(experience, format, tPeriod),
    name: t(`${experience.slug}.name` as never),
    company: t(`${experience.slug}.company` as never),
    location: t(`${experience.slug}.location` as never),
    highlights:
      (t.raw(`${experience.slug}.descriptions` as never) as string[]) ?? [],
    projects: PROJECTS.filter(
      (project) => project.experienceSlug === experience.slug,
    ).map((project) => ({
      project,
      name: tProjects(`${project.slug}.name` as never),
      description: tProjects(`${project.slug}.description` as never),
    })),
    recommendations: RECOMMENDATIONS.filter(
      (recommendation) => recommendation.experienceSlug === experience.slug,
    ),
  });
}

function RelatedProjectRow({ project, name, description }: RelatedProject) {
  const content = (
    <>
      <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded-md border border-border/50 dark:border-overlay-medium">
        <Image
          src={project.imageUrl}
          alt=""
          className={cn("object-cover", project.imagePosition)}
          sizes="80px"
          fill
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-xs">{name}</p>
        <p className="line-clamp-2 text-muted-foreground text-xs">
          {description}
        </p>
      </div>
    </>
  );

  if (!project.url) {
    return <div className="flex items-center gap-3">{content}</div>;
  }

  return (
    <Link
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-lg transition-colors hover:text-primary"
    >
      {content}
      <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
    </Link>
  );
}

function RecommendationQuote({
  recommendation,
}: {
  recommendation: RecommendationEntry;
}) {
  const t = useTranslations("Commands.recommendations");
  const { recommender } = recommendation;

  return (
    <figure className="space-y-3">
      <blockquote className="flex gap-2">
        <Quote className="h-3.5 w-3.5 shrink-0 text-primary/70" />
        <p
          dir="auto"
          className="text-pretty text-foreground/90 text-xs italic leading-relaxed"
        >
          {recommendation.quote}
        </p>
      </blockquote>
      <figcaption className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-xs">{recommender.name}</p>
          <p className="text-muted-foreground text-xs">
            {recommender.role} · {recommender.company}
          </p>
        </div>
        <a
          href={`/recommendations/${recommendation.file}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-1 font-semibold text-secondary text-xs ring-1 ring-secondary/20 ring-inset transition-colors duration-200 hover:bg-secondary/20"
        >
          <Play className="h-3.5 w-3.5" />
          {t("readLetter")}
        </a>
      </figcaption>
    </figure>
  );
}

const PANEL_ENTER_TRANSITION = { duration: DURATION.base, ease: EASE_OUT };

function TabPanel({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <TabsContent value={value}>
      <m.div
        className={cn("origin-top", className)}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={PANEL_ENTER_TRANSITION}
      >
        {children}
      </m.div>
    </TabsContent>
  );
}

function ExperienceTabs({ details }: { details: ExperienceDetails }) {
  const t = useTranslations("Commands.experiences");
  const { experience, projects, recommendations } = details;

  const tabs = [
    {
      value: "skills",
      label: t("skills"),
      icon: Wrench,
      count: experience.skills.length,
    },
    {
      value: "projects",
      label: t("projects"),
      icon: FolderOpen,
      count: projects.length,
    },
    {
      value: "recommendations",
      label: t("recommendations"),
      icon: Quote,
      count: recommendations.length,
    },
  ].filter((tab) => tab.count > 0);

  if (tabs.length === 0) return null;

  return (
    <Tabs
      defaultValue={tabs[0].value}
      className="flex flex-col gap-3 rounded-xl border border-border/50 bg-background/30 p-3 dark:border-overlay-medium"
    >
      <TabsList className="gap-0.5 overflow-x-auto sm:gap-1">
        {tabs.map(({ value, label, icon: Icon, count }) => (
          <TabsTrigger key={value} value={value} className="px-1.5 sm:px-2.5">
            <Icon aria-hidden className="hidden h-3 w-3 sm:block" />
            {label}
            <span className="hidden tabular-nums opacity-70 sm:inline">
              {count}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      <AutoHeight>
        <TabPanel value="skills" className="flex flex-wrap gap-1.5">
          {experience.skills.map((skill) => (
            <Tag key={skill} label={skill} variant="teal" />
          ))}
        </TabPanel>
        <TabPanel value="projects">
          <ul className="space-y-2.5">
            {projects.map((related) => (
              <li key={related.project.slug}>
                <RelatedProjectRow {...related} />
              </li>
            ))}
          </ul>
        </TabPanel>
        <TabPanel value="recommendations" className="space-y-4">
          {recommendations.map((recommendation) => (
            <RecommendationQuote
              key={recommendation.file}
              recommendation={recommendation}
            />
          ))}
        </TabPanel>
      </AutoHeight>
    </Tabs>
  );
}

function ExperienceDialog({
  details,
  open,
  onClose,
}: {
  details: ExperienceDetails | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Commands.experiences");
  const companyUrl = details?.experience.companyUrl;

  return (
    <DetailDialog
      open={open && details !== null}
      onClose={onClose}
      title={details?.name ?? ""}
      description={
        details ? `${details.company} · ${details.location}` : undefined
      }
      link={
        companyUrl
          ? { href: companyUrl, title: t("visit"), label: t("visit") }
          : undefined
      }
      closeLabel={t("close")}
    >
      {details ? (
        <div className="space-y-4">
          <p className="text-muted-foreground text-xs">{details.period}</p>
          {details.highlights.length > 0 && (
            <DetailSection title={t("highlights")}>
              <DetailBullets items={details.highlights} />
            </DetailSection>
          )}
          <ExperienceTabs key={details.experience.slug} details={details} />
        </div>
      ) : null}
    </DetailDialog>
  );
}

function hasCounters({ projects, recommendations }: ExperienceDetails) {
  return projects.length > 0 || recommendations.length > 0;
}

function countBodySteps(details: ExperienceDetails): number {
  const nameAndCompanySteps = 2;
  return (
    nameAndCompanySteps +
    (hasCounters(details) ? 1 : 0) +
    details.experience.skills.length
  );
}

function ExperienceCardBody({
  details,
  step,
}: {
  details: ExperienceDetails;
  step: TypedStep;
}) {
  const t = useTranslations("Commands.experiences");
  const { experience, projects, recommendations } = details;
  const showCounters = hasCounters(details);
  const companyStep = showCounters ? 2 : 1;

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <TypeStep as="p" className="min-w-0 font-semibold text-sm" {...step(0)}>
          {details.name}
        </TypeStep>
        {showCounters ? (
          <TypeStep
            as="span"
            className="flex shrink-0 items-center gap-3 pt-0.5 text-muted-foreground"
            {...step(1)}
          >
            {projects.length > 0 && (
              <span
                className="inline-flex items-center gap-1"
                title={t("projects")}
              >
                <FolderOpen className="h-3 w-3" />
                {projects.length}
              </span>
            )}
            {recommendations.length > 0 && (
              <span
                className="inline-flex items-center gap-1"
                title={t("recommendations")}
              >
                <Quote className="h-3 w-3" />
                {recommendations.length}
              </span>
            )}
          </TypeStep>
        ) : null}
      </div>
      <TypeStep as="p" className="text-muted-foreground" {...step(companyStep)}>
        {details.company}
        <span aria-hidden className="@md:inline hidden">
          {" · "}
        </span>
        <br className="@md:hidden" />
        {details.location}
      </TypeStep>
      <div className="flex flex-wrap gap-1 pt-1">
        {experience.skills.map((skill, index) => (
          <TypeStep
            key={skill}
            as="span"
            className="inline-flex items-center"
            {...step(companyStep + 1 + index)}
          >
            <Tag label={skill} variant="teal" />
          </TypeStep>
        ))}
      </div>
    </>
  );
}

function CExperiences() {
  const t = useTranslations("Commands.experiences");
  const tCommands = useTranslations("Commands");
  const grep = useGrep();
  const grepRaw = useGrepRaw();
  const toDetails = useExperienceDetails();
  const [selected, setSelected] = useState<ExperienceEntry | null>(null);
  const [open, setOpen] = useState(false);

  const visible = filterByGrep(EXPERIENCES.map(toDetails), grep, (details) => [
    details.period,
    details.name,
    details.company,
    details.location,
    ...details.highlights,
    ...details.experience.skills,
    ...details.projects.map((related) => related.name),
  ]);
  const typing = useTimelineCardsTyping(visible.map(countBodySteps));

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
    <>
      <AnimatedSpan>
        {visible.map((details, index) => (
          <TimelineCard
            key={details.experience.slug}
            range={details.range}
            duration={details.duration}
            ongoing={!details.experience.end}
            isLast={index === visible.length - 1}
            typing={typing[index]}
            label={t("details", { name: details.name })}
            onSelect={() => {
              setSelected(details.experience);
              setOpen(true);
            }}
          >
            {(step) => <ExperienceCardBody details={details} step={step} />}
          </TimelineCard>
        ))}
      </AnimatedSpan>
      <ExperienceDialog
        details={selected ? toDetails(selected) : null}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default CExperiences;
