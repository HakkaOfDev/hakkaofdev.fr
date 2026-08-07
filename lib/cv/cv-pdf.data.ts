import { getFormatter, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  EDUCATION,
  getYearsOfExperience,
  HOBBIES,
  LANGUAGES,
  SITE,
  SOCIALS,
} from "@/lib/constants";
import {
  type CvSelection,
  DEFAULT_SELECTION,
  selectExperiences,
  selectProjects,
  selectSkillGroups,
} from "@/lib/cv/cv-selection";
import { formatPeriod } from "@/lib/utils/period.utils";

export const CV_FILE_NAME_BASE = "alexandre-gossard-cv";
export const CV_PREVIEW_URL = "/api/cv";

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
    hobbies: string;
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
  }[];
  skills: { slug: string; label: string; values: string[] }[];
  languages: { code: string; flag: string; name: string; level: string }[];
  hobbies: string[];
};

export async function getCvData(
  locale: Locale,
  selection: CvSelection = DEFAULT_SELECTION,
): Promise<CvData> {
  const tCv = await getTranslations({ locale, namespace: "CV" });
  const tPeriod = await getTranslations({ locale, namespace: "CV.period" });
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const format = await getFormatter({ locale });

  const projects = selectProjects(selection).map((p) => ({
    slug: p.slug,
    name: tCv(`projects.${p.slug}.name` as never),
    description: tCv(`projects.${p.slug}.description` as never),
    url: p.url,
    tags: [...p.tags],
  }));

  const experiences = selectExperiences(selection).map((e) => {
    const descriptionsKey = `experiences.${e.slug}.descriptions` as never;
    return {
      slug: e.slug,
      period: formatPeriod(e, format, tPeriod),
      title: tCv(`experiences.${e.slug}.name` as never),
      company: tCv(`experiences.${e.slug}.company` as never),
      companyUrl: e.companyUrl,
      location: tCv(`experiences.${e.slug}.location` as never),
      descriptions: tCv.raw(descriptionsKey) as string[],
    };
  });

  const education = EDUCATION.map((edu) => ({
    slug: edu.slug,
    period: formatPeriod(edu, format, tPeriod),
    name: tCv(`education.${edu.slug}.name` as never),
    location: tCv(`education.${edu.slug}.location` as never),
  }));

  const skills = selectSkillGroups(selection).map((s) => ({
    slug: s.slug,
    label: tCv(`skillGroups.${s.slug}` as never),
    values: s.values,
  }));

  const languages = LANGUAGES.map((l) => ({
    code: l.code,
    flag: l.flag,
    name: tCv(`spokenLanguages.${l.code}` as never),
    level: tCv(`languageLevels.${l.levelSlug}` as never),
  }));

  const hobbies = HOBBIES.map((h) => tCv(`hobbies.${h}` as never));

  return {
    fileName: buildCvFileName(locale),
    language: locale,
    documentTitle: `${SITE.name} - ${tCv("documentTitleSuffix")}`,
    subject: tCv("subject"),
    name: SITE.name,
    jobTitle: tMeta("jobTitle"),
    website: SITE.url,
    email: SITE.email,
    location: tCv("location"),
    summary: tCv("summary", { years: getYearsOfExperience() }),
    sections: {
      summary: tCv("sections.summary"),
      experience: tCv("sections.experience"),
      skills: tCv("sections.skills"),
      education: tCv("sections.education"),
      projects: tCv("sections.projects"),
      languages: tCv("sections.languages"),
      links: tCv("sections.links"),
      hobbies: tCv("sections.hobbies"),
    },
    socials: SOCIALS.map((s) => ({ name: s.name, url: s.url })),
    projects,
    experiences,
    education,
    skills,
    languages,
    hobbies,
  };
}
