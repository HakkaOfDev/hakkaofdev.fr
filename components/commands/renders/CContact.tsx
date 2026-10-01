"use client";

import { ArrowUpRight, Mail, MapPin } from "lucide-react";
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
import { CopyButton } from "@/components/commands/renders/CopyButton";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { revealItemVariants } from "@/lib/animation/motion";
import { SITE, SOCIALS } from "@/lib/constants";
import { filterByGrep, matchesGrep } from "@/lib/utils/grep.utils";

type Social = (typeof SOCIALS)[number];

type ContactSection = {
  key: string;
  steps: number;
  render: (progress: TypedProgress) => ReactNode;
};

const ROW_STEPS = 2;

function getDisplayLink(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

function DetailRow({
  progress,
  firstStep,
  icon,
  label,
  children,
}: {
  progress: TypedProgress;
  firstStep: number;
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid @md:grid-cols-[10rem_minmax(0,1fr)] @md:items-center @md:gap-3 gap-1">
      <TypeStep
        className="flex items-center gap-1.5 text-muted-foreground"
        {...typedStep(progress, firstStep)}
      >
        {icon}
        {label}
      </TypeStep>
      <TypeStep
        className="flex flex-wrap items-center gap-2"
        {...typedStep(progress, firstStep + 1)}
      >
        {children}
      </TypeStep>
    </div>
  );
}

function SocialCard({ social }: { social: Social }) {
  const Icon = social.icon;
  return (
    <Link
      href={social.url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-border/60 @md:p-3 p-2.5 transition-colors hover:border-primary/50 dark:border-overlay-medium"
    >
      <Icon
        size={16}
        className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
      />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">{social.name}</p>
        <p className="truncate text-muted-foreground" dir="ltr">
          {getDisplayLink(social.url)}
        </p>
      </div>
      <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
    </Link>
  );
}

function CContact() {
  const t = useTranslations("Commands.contact");
  const tCommands = useTranslations("Commands");
  const tMeta = useTranslations("Metadata");
  const prefersReduced = useReducedMotion();
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const location = tMeta("location");
  const visibleSocials = filterByGrep(SOCIALS, grep, (social) => [
    social.name,
    social.url,
  ]);
  const showIntro = matchesGrep(t("intro"), grep);
  const showEmail = matchesGrep(`${t("primaryEmail")} ${SITE.email}`, grep);
  const showLocation = matchesGrep(`${t("location")} ${location}`, grep);
  const detailSteps =
    (showEmail ? ROW_STEPS : 0) + (showLocation ? ROW_STEPS : 0);

  const allSections: ContactSection[] = [
    {
      key: "intro",
      steps: showIntro ? 1 : 0,
      render: (progress) => (
        <TypeStep
          as="p"
          className="text-muted-foreground"
          {...typedStep(progress, 0)}
        >
          {t("intro")}
        </TypeStep>
      ),
    },
    {
      key: "details",
      steps: detailSteps,
      render: (progress) => (
        <m.section
          className="grid gap-3 rounded-lg border border-border/60 @md:p-3 p-2.5 dark:border-overlay-medium"
          variants={revealItemVariants}
          initial={prefersReduced ? false : "hidden"}
          animate="visible"
        >
          {showEmail ? (
            <DetailRow
              progress={progress}
              firstStep={0}
              icon={<Mail aria-hidden className="h-3 w-3" />}
              label={t("primaryEmail")}
            >
              <Link
                href={`mailto:${SITE.email}`}
                dir="ltr"
                className="break-all font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
              >
                {SITE.email}
              </Link>
              <CopyButton text={SITE.email} />
            </DetailRow>
          ) : null}
          {showLocation ? (
            <DetailRow
              progress={progress}
              firstStep={showEmail ? ROW_STEPS : 0}
              icon={<MapPin aria-hidden className="h-3 w-3" />}
              label={t("location")}
            >
              <span className="font-semibold text-foreground">{location}</span>
            </DetailRow>
          ) : null}
        </m.section>
      ),
    },
    {
      key: "socials",
      steps: visibleSocials.length > 0 ? 1 + visibleSocials.length : 0,
      render: (progress) => (
        <div className="grid gap-2">
          <TypeStep
            as="p"
            className="text-muted-foreground"
            {...typedStep(progress, 0)}
          >
            {t("socialProfiles")}
          </TypeStep>
          <div className="grid @md:grid-cols-2 gap-2">
            {visibleSocials.map((social, index) => (
              <TypeStep
                key={social.name}
                {...typedStep(progress, 1 + index)}
                caret={false}
              >
                <SocialCard social={social} />
              </TypeStep>
            ))}
          </div>
        </div>
      ),
    },
  ];
  const sections = allSections.filter((section) => section.steps > 0);

  const progress = useTypedGroups(sections.map((section) => section.steps));

  if (grep && sections.length === 0) {
    return (
      <AnimatedSpan>
        <p className="text-muted-foreground text-xs">
          {tCommands("noMatches", { pattern: grepRaw })}
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan className="@container gap-3">
      {sections.map((section, index) =>
        progress[index].typed === 0 ? null : (
          <div key={section.key}>{section.render(progress[index])}</div>
        ),
      )}
    </AnimatedSpan>
  );
}

export default CContact;
