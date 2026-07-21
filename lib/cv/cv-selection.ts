import type { Locale } from "@/i18n/routing";
import { PROJECTS } from "@/lib/constants/projects.constants";
import { EXPERIENCES } from "@/lib/constants/resume.constants";
import { SKILLS } from "@/lib/constants/skills.constants";

/**
 * Shared source of truth for the customizable-CV query contract, imported by
 * both the client command card (`CCv`) and the `/api/cv` route. Kept free of
 * server-only imports so it is safe inside a `"use client"` component.
 *
 * All three categories use include-list semantics (list what is IN). A param is
 * omitted from the URL when its selection equals that category's default, so the
 * default share URL stays clean (`/api/cv?lang=en`). Presence of a param — even
 * empty (`projects=`) — marks an explicit selection; an empty selection drops
 * that whole section from the PDF.
 */

export const CV_ENDPOINT = "/api/cv";

export type CvCategory = "experiences" | "projects" | "skills";

const CATEGORIES: readonly CvCategory[] = ["experiences", "projects", "skills"];

/** Every selectable value, in canonical (declaration) order per category. */
export const ALL_EXPERIENCE_SLUGS: readonly string[] = EXPERIENCES.map(
  (e) => e.slug,
);
export const ALL_PROJECT_SLUGS: readonly string[] = PROJECTS.map((p) => p.slug);
export const ALL_SKILL_VALUES: readonly string[] = SKILLS.flatMap(
  (g) => g.values,
);

/** Projects shown by default — the first five, matching the original CV. */
export const DEFAULT_PROJECT_SLUGS: readonly string[] = ALL_PROJECT_SLUGS.slice(
  0,
  5,
);

const CANONICAL: Record<CvCategory, readonly string[]> = {
  experiences: ALL_EXPERIENCE_SLUGS,
  projects: ALL_PROJECT_SLUGS,
  skills: ALL_SKILL_VALUES,
};

const DEFAULTS: Record<CvCategory, readonly string[]> = {
  experiences: ALL_EXPERIENCE_SLUGS,
  projects: DEFAULT_PROJECT_SLUGS,
  skills: ALL_SKILL_VALUES,
};

export type CvSelection = {
  experiences: string[];
  projects: string[];
  skills: string[];
};

/** Today's CV: all experiences, first five projects, all skills. */
export const DEFAULT_SELECTION: CvSelection = {
  experiences: [...DEFAULTS.experiences],
  projects: [...DEFAULTS.projects],
  skills: [...DEFAULTS.skills],
};

/** Keep only known values, forced into canonical order. */
function canonicalize(
  category: CvCategory,
  chosen: readonly string[],
): string[] {
  const wanted = new Set(chosen);
  return CANONICAL[category].filter((value) => wanted.has(value));
}

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const other = new Set(b);
  return a.every((value) => other.has(value));
}

/** True when a category's selection matches its default (order-independent). */
export function isCategoryDefault(
  category: CvCategory,
  values: readonly string[],
): boolean {
  return sameSet(canonicalize(category, values), DEFAULTS[category]);
}

/** True when the whole selection is the default CV (no params needed). */
export function isDefaultSelection(selection: CvSelection): boolean {
  return CATEGORIES.every((c) => isCategoryDefault(c, selection[c]));
}

/**
 * Build the `/api/cv` URL for a selection. Categories equal to their default are
 * omitted; a cleared category emits an empty param (`projects=`) to signal "drop
 * this section". Values are emitted in canonical order, comma-separated, each
 * percent-encoded (commas stay literal as separators).
 */
export function buildCvUrl({
  lang,
  download,
  selection,
}: {
  lang: Locale;
  download?: boolean;
  selection?: CvSelection;
}): string {
  const parts: string[] = [`lang=${lang}`];

  if (selection) {
    for (const category of CATEGORIES) {
      const values = canonicalize(category, selection[category]);
      if (sameSet(values, DEFAULTS[category])) continue;
      parts.push(`${category}=${values.map(encodeURIComponent).join(",")}`);
    }
  }

  if (download) parts.push("download=1");

  return `${CV_ENDPOINT}?${parts.join("&")}`;
}

function parseCategory(
  searchParams: URLSearchParams,
  category: CvCategory,
): string[] {
  if (!searchParams.has(category)) return [...DEFAULTS[category]];
  const raw = searchParams.get(category) ?? "";
  const chosen = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return canonicalize(category, chosen);
}

/**
 * Read a selection from `/api/cv` query params. A missing category param falls
 * back to its default; a present param (even empty) is taken literally, with
 * unknown values dropped and the rest forced into canonical order.
 */
export function parseSelection(searchParams: URLSearchParams): CvSelection {
  return {
    experiences: parseCategory(searchParams, "experiences"),
    projects: parseCategory(searchParams, "projects"),
    skills: parseCategory(searchParams, "skills"),
  };
}

/* ── Applying a selection to the source data ──────────────────────────────
 * Pure filters over the constants (canonical order preserved). `getCvData`
 * layers translations on top of these results. Kept here so the selection
 * logic stays in one client-safe, unit-testable module.
 */

/** Experiences to render, in canonical order (empty when the category is cleared). */
export function selectExperiences(selection: CvSelection) {
  const wanted = new Set(selection.experiences);
  return EXPERIENCES.filter((experience) => wanted.has(experience.slug));
}

/** Projects to render, in canonical order (empty when the category is cleared). */
export function selectProjects(selection: CvSelection) {
  const wanted = new Set(selection.projects);
  return PROJECTS.filter((project) => wanted.has(project.slug));
}

/**
 * Skill groups to render, each narrowed to its selected values. Groups left with
 * no selected values are dropped, so partially- and fully-cleared skills both
 * collapse cleanly.
 */
export function selectSkillGroups(
  selection: CvSelection,
): { slug: string; values: string[] }[] {
  const wanted = new Set(selection.skills);
  return SKILLS.map((group) => ({
    slug: group.slug,
    values: group.values.filter((value) => wanted.has(value)),
  })).filter((group) => group.values.length > 0);
}
