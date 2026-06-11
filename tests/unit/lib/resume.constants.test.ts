import { describe, expect, it } from "vitest";
import {
  CAREER_START,
  EDUCATION,
  EXPERIENCES,
  getYearsOfExperience,
} from "@/lib/constants";
import { comparePeriodsDesc } from "@/lib/utils/period.utils";

function expectSortedByRecency(
  entries: ReadonlyArray<{ slug: string; start: string; end?: string }>,
) {
  for (let i = 0; i < entries.length - 1; i++) {
    expect(
      comparePeriodsDesc(entries[i], entries[i + 1]),
      `${entries[i].slug} should come before ${entries[i + 1].slug}`,
    ).toBeLessThanOrEqual(0);
  }
}

describe("resume constants ordering", () => {
  it("lists experiences most recent / ongoing first", () => {
    expectSortedByRecency(EXPERIENCES);
  });

  it("lists education most recent first", () => {
    expectSortedByRecency(EDUCATION);
  });
});

describe("years of experience", () => {
  it("anchors CAREER_START to the earliest experience start", () => {
    const earliest = EXPERIENCES.reduce(
      (min, e) => (e.start < min ? e.start : min),
      EXPERIENCES[0].start,
    );
    expect(CAREER_START).toBe(earliest);
  });

  it("counts whole years from CAREER_START to the given date", () => {
    // CAREER_START is 2022-03; mid-June 2026 → 4 completed years.
    expect(getYearsOfExperience(new Date(Date.UTC(2026, 5, 15)))).toBe(4);
  });
});
