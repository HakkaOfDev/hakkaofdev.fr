import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  EDUCATION,
  EXPERIENCES,
  LANGUAGES,
  PROJECTS,
  SITE,
  SKILLS,
  SOCIALS,
} from "@/lib/constants";

export const CV_FILE_NAME_BASE = "alexandre-gossard-cv";
export const CV_PREVIEW_URL = "/api/cv";
export const CV_DOWNLOAD_URL = "/api/cv?download=1";

export function buildCvFileName(locale: Locale) {
  return `${CV_FILE_NAME_BASE}-${locale}.pdf`;
}

export type CvData = {
  fileName: string;
  language: string;
  documentTitle: string;
  subject: string;
  name: string;
  jobTitle: string;
  website: string;
  email: string;
  location: string;
  summary: string;
  sections: {
    summary: string;
    experience: string;
    skills: string;
    education: string;
    projects: string;
    languages: string;
    links: string;
  };
  socials: { name: string; url: string }[];
  projects: {
    slug: string;
    name: string;
    description: string;
    url?: string;
    tags: string[];
  }[];
  experiences: {
    slug: string;
    period: string;
    title: string;
    company: string;
    companyUrl?: string;
    location: string;
    descriptions: string[];
  }[];
  education: {
    slug: string;
    period: string;
    name: string;
    location: string;
    descriptions: string[];
  }[];
  skills: { slug: string; label: string; values: string[] }[];
  languages: { code: string; flag: string; name: string; level: string }[];
};

export async function getCvData(locale: Locale): Promise<CvData> {
  const tCv = await getTranslations({ locale, namespace: "CV" });
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });

  const projects = PROJECTS.slice(0, 5).map((p) => ({
    slug: p.slug,
    name: tCv(`projects.${p.slug}.name` as never),
    description: tCv(`projects.${p.slug}.description` as never),
    url: p.url,
    tags: [...p.tags],
  }));

  const experiences = EXPERIENCES.map((e) => ({
    slug: e.slug,
    period: tCv(`experiences.${e.slug}.period` as never),
    title: tCv(`experiences.${e.slug}.name` as never),
    company: tCv(`experiences.${e.slug}.company` as never),
    companyUrl: e.companyUrl,
    location: tCv(`experiences.${e.slug}.location` as never),
    descriptions: tCv.raw(
      `experiences.${e.slug}.descriptions` as never,
    ) as string[],
  }));

  const education = EDUCATION.map((edu) => ({
    slug: edu.slug,
    period: tCv(`education.${edu.slug}.period` as never),
    name: tCv(`education.${edu.slug}.name` as never),
    location: tCv(`education.${edu.slug}.location` as never),
    descriptions:
      (tCv.raw(`education.${edu.slug}.descriptions` as never) as string[]) ??
      [],
  }));

  const skills = SKILLS.map((s) => ({
    slug: s.slug,
    label: tCv(`skillGroups.${s.slug}` as never),
    values: [...s.values],
  }));

  const languages = LANGUAGES.map((l) => ({
    code: l.code,
    flag: l.flag,
    name: tCv(`spokenLanguages.${l.code}` as never),
    level: tCv(`languageLevels.${l.levelSlug}` as never),
  }));

  return {
    fileName: buildCvFileName(locale),
    language: locale,
    documentTitle: `${SITE.name} - ${tCv("documentTitleSuffix")}`,
    subject: tCv("subject"),
    name: SITE.name,
    jobTitle: tMeta("jobTitle"),
    website: SITE.url,
    email: SITE.email,
    location: tMeta("location"),
    summary: tCv("summary"),
    sections: {
      summary: tCv("sections.summary"),
      experience: tCv("sections.experience"),
      skills: tCv("sections.skills"),
      education: tCv("sections.education"),
      projects: tCv("sections.projects"),
      languages: tCv("sections.languages"),
      links: tCv("sections.links"),
    },
    socials: SOCIALS.map((s) => ({ name: s.name, url: s.url })),
    projects,
    experiences,
    education,
    skills,
    languages,
  };
}
