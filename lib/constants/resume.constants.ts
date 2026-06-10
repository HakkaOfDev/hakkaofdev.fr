import { SITE } from "./site.constants";

export type EducationEntry = {
  /** Key under `CV.education.{slug}` for translated fields. */
  slug: string;
};

export type ExperienceEntry = {
  slug: string;
  companyUrl?: string;
};

export type RecommendationEntry = {
  /** Experience slug this recommendation is bound to (must exist in EXPERIENCES). */
  experienceSlug: string;
  /** PDF filename under `public/recommendations/`. */
  file: string;
  /** Recommender identity (proper nouns; not localized). */
  recommender: {
    name: string;
    role: string;
    company: string;
    url?: string;
  };
  /** Verbatim pull-quote from the letter (kept in the letter's language as a citation). */
  quote: string;
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

/**
 * Recommendation letters surfaced by the `recommendations` command.
 * Each entry is bound to a real experience via `experienceSlug` (enforced by
 * `tests/unit/lib/recommendations.test.ts`). The PDF lives under
 * `public/recommendations/{file}`.
 */
export const RECOMMENDATIONS: ReadonlyArray<RecommendationEntry> = [
  {
    experienceSlug: "kabila",
    file: "kabila.pdf",
    recommender: {
      name: "Manu Cabrera",
      role: "CEO & Co-Founder",
      company: "BRAVALTA & Kabila",
      url: "https://bravalta.com",
    },
    quote:
      "I recommend Alex without reservation to any company facing significant software and software-architecture challenges. If you are looking for a young, highly capable engineer with great attitude, energy, a strong technical foundation, an ability to keep learning, and excellent teamwork, Alex will be a fundamental piece of your team.",
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
