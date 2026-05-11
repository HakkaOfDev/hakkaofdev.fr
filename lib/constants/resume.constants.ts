import { SITE } from "./site.constants";

export type EducationEntry = {
  /** Key under `CV.education.{slug}` for translated fields. */
  slug: string;
};

export type ExperienceEntry = {
  slug: string;
  companyUrl?: string;
};

export type SpokenLanguageEntry = {
  /** Key under `CV.spokenLanguages.{code}` for the translated language name. */
  code: string;
  flag: string;
  /** Key under `CV.languageLevels.{slug}` for the translated proficiency. */
  levelSlug: string;
};

export type HobbySlug = string;

export const EDUCATION: ReadonlyArray<EducationEntry> = [
  { slug: "iutSecurity" },
  { slug: "iutNetworks" },
  { slug: "lyceeBac" },
];

export const EXPERIENCES: ReadonlyArray<ExperienceEntry> = [
  { slug: "kabila", companyUrl: "https://kabila.app" },
  { slug: "freelance", companyUrl: SITE.url },
  { slug: "archeMC2", companyUrl: "https://arche-mc2.fr" },
  {
    slug: "efficienceInformatique",
    companyUrl: "https://www.efficience-informatique.net",
  },
];

export const LANGUAGES: ReadonlyArray<SpokenLanguageEntry> = [
  { code: "fr", flag: "🇫🇷", levelSlug: "native" },
  { code: "en", flag: "🇬🇧", levelSlug: "C1" },
  { code: "ru", flag: "🇷🇺", levelSlug: "A2" },
  { code: "es", flag: "🇪🇸", levelSlug: "A2" },
];

export const HOBBIES: ReadonlyArray<HobbySlug> = [
  "motorcycles",
  "cars",
  "weightlifting",
  "calisthenics",
  "traveling",
  "manga",
  "gaming",
];
