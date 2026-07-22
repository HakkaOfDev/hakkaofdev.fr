import { describe, expect, it, vi } from "vitest";

// Minimal next-intl stubs: translators echo their key, formatters return fixed
// strings. The tests assert selection/filtering, not localized text.
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => {
    const t = ((key: string) => key) as unknown as {
      (key: string): string;
      raw: (key: string) => unknown;
    };
    t.raw = () => [];
    return t;
  }),
  getFormatter: vi.fn(async () => ({
    dateTime: () => "Month Year",
    number: () => "1 yr",
  })),
}));

import { getCvData } from "@/lib/cv/cv-pdf.data";
import {
  ALL_PROJECT_SLUGS,
  type CvSelection,
  DEFAULT_SELECTION,
} from "@/lib/cv/cv-selection";

describe("getCvData selection", () => {
  it("uses today's defaults when no selection is passed", async () => {
    const data = await getCvData("en");
    expect(data.experiences).toHaveLength(3);
    expect(data.projects).toHaveLength(5);
    expect(data.skills.length).toBeGreaterThan(0);
  });

  it("filters projects to the chosen subset", async () => {
    const selection: CvSelection = {
      ...DEFAULT_SELECTION,
      projects: [ALL_PROJECT_SLUGS[0]],
    };
    const data = await getCvData("en", selection);
    expect(data.projects.map((p) => p.slug)).toEqual([ALL_PROJECT_SLUGS[0]]);
  });

  it("drops emptied categories entirely", async () => {
    const data = await getCvData("en", {
      experiences: [],
      projects: [],
      skills: [],
    });
    expect(data.experiences).toEqual([]);
    expect(data.projects).toEqual([]);
    expect(data.skills).toEqual([]);
  });

  it("narrows skill groups to selected values and drops emptied groups", async () => {
    const data = await getCvData("en", {
      ...DEFAULT_SELECTION,
      skills: ["Next.js", "React"],
    });
    expect(data.skills).toHaveLength(1);
    expect(data.skills[0].values).toEqual(["Next.js", "React"]);
  });
});
