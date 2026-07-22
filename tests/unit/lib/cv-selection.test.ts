import { describe, expect, it } from "vitest";
import {
  ALL_EXPERIENCE_SLUGS,
  ALL_PROJECT_SLUGS,
  ALL_SKILL_VALUES,
  buildCvUrl,
  CV_ENDPOINT,
  type CvSelection,
  DEFAULT_PROJECT_SLUGS,
  DEFAULT_SELECTION,
  parseSelection,
  selectExperiences,
  selectProjects,
  selectSkillGroups,
} from "@/lib/cv/cv-selection";

function params(query: string): URLSearchParams {
  return new URLSearchParams(query);
}

describe("cv-selection defaults", () => {
  it("defaults experiences and skills to everything", () => {
    expect(DEFAULT_SELECTION.experiences).toEqual(ALL_EXPERIENCE_SLUGS);
    expect(DEFAULT_SELECTION.skills).toEqual(ALL_SKILL_VALUES);
  });

  it("defaults projects to the first five", () => {
    expect(DEFAULT_PROJECT_SLUGS).toEqual(ALL_PROJECT_SLUGS.slice(0, 5));
    expect(DEFAULT_SELECTION.projects).toEqual(DEFAULT_PROJECT_SLUGS);
  });
});

describe("buildCvUrl", () => {
  it("emits only lang when the selection is the default", () => {
    expect(buildCvUrl({ lang: "en", selection: DEFAULT_SELECTION })).toBe(
      `${CV_ENDPOINT}?lang=en`,
    );
  });

  it("emits a clean url when no selection is given at all", () => {
    expect(buildCvUrl({ lang: "fr" })).toBe(`${CV_ENDPOINT}?lang=fr`);
  });

  it("appends download=1 when downloading", () => {
    expect(buildCvUrl({ lang: "en", download: true })).toBe(
      `${CV_ENDPOINT}?lang=en&download=1`,
    );
  });

  it("lists a chosen experience subset in canonical order", () => {
    const selection: CvSelection = {
      ...DEFAULT_SELECTION,
      // deliberately out of canonical order to prove it is re-sorted
      experiences: [ALL_EXPERIENCE_SLUGS[1], ALL_EXPERIENCE_SLUGS[0]],
    };
    expect(buildCvUrl({ lang: "en", selection })).toBe(
      `${CV_ENDPOINT}?lang=en&experiences=${ALL_EXPERIENCE_SLUGS[0]},${ALL_EXPERIENCE_SLUGS[1]}`,
    );
  });

  it("emits an empty param when a category is cleared (drops the section)", () => {
    const selection: CvSelection = { ...DEFAULT_SELECTION, projects: [] };
    expect(buildCvUrl({ lang: "en", selection })).toBe(
      `${CV_ENDPOINT}?lang=en&projects=`,
    );
  });

  it("lists all projects when the user goes beyond the default five", () => {
    const selection: CvSelection = {
      ...DEFAULT_SELECTION,
      projects: [...ALL_PROJECT_SLUGS],
    };
    expect(buildCvUrl({ lang: "en", selection })).toBe(
      `${CV_ENDPOINT}?lang=en&projects=${ALL_PROJECT_SLUGS.join(",")}`,
    );
  });

  it("percent-encodes skill values with reserved characters, keeping commas literal", () => {
    const selection: CvSelection = {
      ...DEFAULT_SELECTION,
      skills: ["Next.js", "shadcn/ui"],
    };
    expect(buildCvUrl({ lang: "en", selection })).toBe(
      `${CV_ENDPOINT}?lang=en&skills=Next.js,shadcn%2Fui`,
    );
  });
});

describe("parseSelection", () => {
  it("returns the defaults when no category params are present", () => {
    expect(parseSelection(params("lang=en"))).toEqual(DEFAULT_SELECTION);
  });

  it("treats a present-but-empty param as an explicit empty selection", () => {
    expect(parseSelection(params("projects=")).projects).toEqual([]);
  });

  it("keeps only known slugs, in canonical order", () => {
    const parsed = parseSelection(
      params(
        `experiences=${ALL_EXPERIENCE_SLUGS[1]},nope,${ALL_EXPERIENCE_SLUGS[0]}`,
      ),
    );
    expect(parsed.experiences).toEqual([
      ALL_EXPERIENCE_SLUGS[0],
      ALL_EXPERIENCE_SLUGS[1],
    ]);
  });

  it("keeps only known skill values, in canonical order", () => {
    const parsed = parseSelection(params("skills=React,made-up,Next.js"));
    expect(parsed.skills).toEqual(["Next.js", "React"]);
  });

  it("round-trips a custom selection through buildCvUrl", () => {
    const selection: CvSelection = {
      experiences: [ALL_EXPERIENCE_SLUGS[0]],
      projects: ALL_PROJECT_SLUGS.slice(0, 3),
      skills: ["Next.js", "React", "shadcn/ui"],
    };
    const url = buildCvUrl({ lang: "en", selection });
    const query = url.slice(url.indexOf("?") + 1);
    expect(parseSelection(params(query))).toEqual(selection);
  });
});

describe("selectExperiences", () => {
  it("returns every experience in canonical order by default", () => {
    expect(selectExperiences(DEFAULT_SELECTION).map((e) => e.slug)).toEqual(
      ALL_EXPERIENCE_SLUGS,
    );
  });

  it("filters to the chosen experiences", () => {
    const selection: CvSelection = {
      ...DEFAULT_SELECTION,
      experiences: [ALL_EXPERIENCE_SLUGS[1]],
    };
    expect(selectExperiences(selection).map((e) => e.slug)).toEqual([
      ALL_EXPERIENCE_SLUGS[1],
    ]);
  });

  it("returns nothing when experiences are cleared", () => {
    expect(
      selectExperiences({ ...DEFAULT_SELECTION, experiences: [] }),
    ).toEqual([]);
  });
});

describe("selectProjects", () => {
  it("returns the first five projects by default", () => {
    expect(selectProjects(DEFAULT_SELECTION).map((p) => p.slug)).toEqual(
      DEFAULT_PROJECT_SLUGS,
    );
  });

  it("can include projects beyond the default five", () => {
    const selection: CvSelection = {
      ...DEFAULT_SELECTION,
      projects: [...ALL_PROJECT_SLUGS],
    };
    expect(selectProjects(selection)).toHaveLength(ALL_PROJECT_SLUGS.length);
  });
});

describe("selectSkillGroups", () => {
  it("returns every group with all values by default", () => {
    expect(
      selectSkillGroups(DEFAULT_SELECTION).flatMap((g) => g.values),
    ).toEqual(ALL_SKILL_VALUES);
  });

  it("keeps only chosen values and drops emptied groups", () => {
    const selection: CvSelection = {
      ...DEFAULT_SELECTION,
      skills: ["Next.js", "React"],
    };
    const groups = selectSkillGroups(selection);
    expect(groups).toHaveLength(1);
    expect(groups[0].values).toEqual(["Next.js", "React"]);
  });

  it("returns nothing when skills are cleared", () => {
    expect(selectSkillGroups({ ...DEFAULT_SELECTION, skills: [] })).toEqual([]);
  });
});
