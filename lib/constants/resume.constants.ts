import { comparePeriodsDesc, completedYearsSince } from "../utils/period.utils";

export type EducationEntry = {
  /** Key under `CV.education.{slug}` for translated fields. */
  slug: string;
  /** Start year (`"YYYY"`). */
  start: string;
  /** End year (`"YYYY"`); omit while ongoing. */
  end?: string;
};

export type ExperienceEntry = {
  slug: string;
  companyUrl?: string;
  /** Start month (`"YYYY-MM"`). */
  start: string;
  /** End month (`"YYYY-MM"`); omit while the position is ongoing. */
  end?: string;
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
  { slug: "iutSecurity", start: "2022", end: "2023" },
  { slug: "iutNetworks", start: "2020", end: "2022" },
  { slug: "lyceeBac", start: "2019", end: "2020" },
].sort(comparePeriodsDesc);

export const EXPERIENCES: ReadonlyArray<ExperienceEntry> = [
  {
    slug: "kabila",
    companyUrl: "https://kabila.app",
    start: "2022-07",
    end: "2026-06",
  },
  {
    slug: "archeMC2",
    companyUrl: "https://arche-mc2.fr",
    start: "2022-09",
    end: "2023-08",
  },
  {
    slug: "efficienceInformatique",
    companyUrl: "https://www.efficience-informatique.net",
    start: "2022-03",
    end: "2022-05",
  },
].sort(comparePeriodsDesc);

/**
 * Start (`"YYYY-MM"`) of the earliest professional experience — the anchor for
 * the "X+ years of experience" figure. Derived from EXPERIENCES, so adding an
 * earlier role keeps the figure correct without touching anything else.
 */
export const CAREER_START: string = EXPERIENCES.reduce(
  (earliest, e) => (e.start < earliest ? e.start : earliest),
  EXPERIENCES[0].start,
);

/** Whole completed years of professional experience as of `now` (floored). */
export function getYearsOfExperience(now?: Date): number {
  return completedYearsSince(CAREER_START, now);
}

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
  "tennis",
  "calisthenics",
  "traveling",
  "manga",
  "gaming",
];
