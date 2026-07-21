"use client";

import { Download, Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Select } from "@/components/ui/Select";
import { type Locale, routing } from "@/i18n/routing";
import { PROJECTS } from "@/lib/constants/projects.constants";
import { EXPERIENCES } from "@/lib/constants/resume.constants";
import { SKILLS } from "@/lib/constants/skills.constants";
import {
  ALL_EXPERIENCE_SLUGS,
  ALL_PROJECT_SLUGS,
  ALL_SKILL_VALUES,
  buildCvUrl,
  type CvSelection,
  DEFAULT_SELECTION,
} from "@/lib/cv/cv-selection";
import { Chip, CvParamSection } from "./CvParamChips";

const LOCALE_NATIVE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  zh: "中文",
  ja: "日本語",
  ru: "Русский",
  uk: "Українська",
  pl: "Polski",
  cs: "Čeština",
  nl: "Nederlands",
  ro: "Română",
  el: "Ελληνικά",
  tr: "Türkçe",
  ko: "한국어",
  hi: "हिन्दी",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
  ar: "العربية",
  he: "עברית",
};

function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function CCv() {
  const t = useTranslations("Commands.cv");
  const tCv = useTranslations("CV");
  const currentLocale = useLocale() as Locale;

  const [lang, setLang] = useState<Locale>(currentLocale);
  const [download, setDownload] = useState(false);
  const [experiences, setExperiences] = useState(
    () => new Set(DEFAULT_SELECTION.experiences),
  );
  const [projects, setProjects] = useState(
    () => new Set(DEFAULT_SELECTION.projects),
  );
  const [skills, setSkills] = useState(() => new Set(DEFAULT_SELECTION.skills));

  const selection = useMemo<CvSelection>(
    () => ({
      experiences: [...experiences],
      projects: [...projects],
      skills: [...skills],
    }),
    [experiences, projects, skills],
  );

  const url = buildCvUrl({ lang, download, selection });
  const downloadUrl = buildCvUrl({ lang, download: true, selection });

  const controls = {
    all: t("selectAll"),
    none: t("selectNone"),
    reset: t("reset"),
  };

  return (
    <AnimatedSpan className="gap-2">
      <div className="overflow-hidden rounded-md border border-emerald-500/30 bg-emerald-500/[0.04]">
        <div className="flex flex-wrap items-center gap-2 border-emerald-500/20 border-b bg-emerald-500/[0.07] px-2.5 py-1.5">
          <span className="rounded bg-emerald-600 px-1.5 py-0.5 font-bold font-mono text-[10px] text-white uppercase tracking-wider dark:bg-emerald-500/90">
            GET
          </span>
          <span className="font-mono text-foreground text-xs">/api/cv</span>
          <span className="ml-auto text-[10px] text-muted-foreground/80">
            {t("description")}
          </span>
        </div>

        <div className="space-y-3 px-2.5 py-2">
          <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
            Parameters
          </div>

          <div className="grid grid-cols-1 items-center gap-x-3 gap-y-1 sm:grid-cols-[140px_1fr]">
            <div className="flex flex-col">
              <span className="font-mono text-foreground text-xs">lang</span>
              <span className="text-[10px] text-muted-foreground/70">
                query · string
              </span>
            </div>
            <Select
              value={lang}
              onChange={(e) => setLang(e.target.value as Locale)}
              aria-label="lang"
              wrapperClassName="max-w-[220px]"
            >
              {routing.locales.map((code) => (
                <option key={code} value={code}>
                  {code} - {LOCALE_NATIVE_NAMES[code]}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 items-center gap-x-3 gap-y-1 sm:grid-cols-[140px_1fr]">
            <div className="flex flex-col">
              <span className="font-mono text-foreground text-xs">
                download
              </span>
              <span className="text-[10px] text-muted-foreground/70">
                query · boolean
              </span>
            </div>
            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-background/70 px-2 py-1 dark:border-overlay-medium dark:bg-overlay-subtle">
              <input
                type="checkbox"
                checked={download}
                onChange={(e) => setDownload(e.target.checked)}
                className="h-3.5 w-3.5 cursor-pointer accent-primary"
              />
              <span className="font-mono text-[11px] text-foreground">
                {download ? "true" : "false"}
              </span>
            </label>
          </div>

          <CvParamSection
            paramName="experiences"
            label={t("experiences")}
            selectedCount={experiences.size}
            total={ALL_EXPERIENCE_SLUGS.length}
            controls={controls}
            onAll={() => setExperiences(new Set(ALL_EXPERIENCE_SLUGS))}
            onNone={() => setExperiences(new Set())}
            onReset={() =>
              setExperiences(new Set(DEFAULT_SELECTION.experiences))
            }
          >
            {EXPERIENCES.map((e) => (
              <Chip
                key={e.slug}
                label={tCv(`experiences.${e.slug}.name` as never)}
                active={experiences.has(e.slug)}
                onToggle={() => setExperiences((prev) => toggle(prev, e.slug))}
              />
            ))}
          </CvParamSection>

          <CvParamSection
            paramName="projects"
            label={t("projects")}
            selectedCount={projects.size}
            total={ALL_PROJECT_SLUGS.length}
            controls={controls}
            onAll={() => setProjects(new Set(ALL_PROJECT_SLUGS))}
            onNone={() => setProjects(new Set())}
            onReset={() => setProjects(new Set(DEFAULT_SELECTION.projects))}
          >
            {PROJECTS.map((p) => (
              <Chip
                key={p.slug}
                label={tCv(`projects.${p.slug}.name` as never)}
                active={projects.has(p.slug)}
                onToggle={() => setProjects((prev) => toggle(prev, p.slug))}
              />
            ))}
          </CvParamSection>

          <CvParamSection
            paramName="skills"
            label={t("skills")}
            selectedCount={skills.size}
            total={ALL_SKILL_VALUES.length}
            controls={controls}
            onAll={() => setSkills(new Set(ALL_SKILL_VALUES))}
            onNone={() => setSkills(new Set())}
            onReset={() => setSkills(new Set(DEFAULT_SELECTION.skills))}
          >
            <div className="flex w-full flex-col gap-2">
              {SKILLS.map((group) => (
                <div key={group.slug} className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                    {tCv(`skillGroups.${group.slug}` as never)}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {group.values.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        active={skills.has(value)}
                        onToggle={() =>
                          setSkills((prev) => toggle(prev, value))
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CvParamSection>
        </div>

        <div className="border-emerald-500/20 border-t bg-overlay-subtle/40 px-2.5 py-2 dark:bg-overlay-subtle/60">
          <div className="mb-1 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
            Request URL
          </div>
          <code className="block break-all font-mono text-[11px] text-foreground">
            {url}
          </code>
        </div>

        <div className="flex flex-wrap gap-2 border-emerald-500/20 border-t px-2.5 py-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-1 font-semibold text-secondary text-xs ring-1 ring-secondary/20 ring-inset transition-colors duration-200 hover:bg-secondary/20"
          >
            <Play className="h-3.5 w-3.5" />
            {t("openPreview")}
          </a>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 font-semibold text-primary text-xs ring-1 ring-primary/20 ring-inset transition-colors duration-200 hover:bg-primary/20"
          >
            <Download className="h-3.5 w-3.5" />
            {t("downloadPdf")}
          </a>
        </div>
      </div>
    </AnimatedSpan>
  );
}

export default CCv;
