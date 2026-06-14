import { createFormatter, createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import {
  comparePeriodsDesc,
  completedYearsSince,
  formatPeriod,
} from "@/lib/utils/period.utils";
import enMessages from "@/messages/en.json";
import frMessages from "@/messages/fr.json";

function makeHelpers(locale: "en" | "fr", messages: typeof enMessages) {
  return {
    format: createFormatter({ locale, timeZone: "UTC" }),
    t: createTranslator({ locale, messages, namespace: "CV.period" }),
  };
}

describe("formatPeriod", () => {
  const { format, t } = makeHelpers("en", enMessages);
  // June 2026, mid-month — deterministic "now" for ongoing periods.
  const now = new Date(Date.UTC(2026, 5, 15));

  it("formats an ongoing month period with the since template and duration", () => {
    expect(formatPeriod({ start: "2022-07" }, format, t, now)).toBe(
      "Since July 2022 (4 yrs)",
    );
  });

  it("formats a closed month range with localized month names and duration", () => {
    expect(formatPeriod({ start: "2022-09", end: "2023-08" }, format, t)).toBe(
      "September 2022 - August 2023 (1 yr)",
    );
  });

  it("counts durations inclusively like LinkedIn", () => {
    expect(formatPeriod({ start: "2022-03", end: "2022-06" }, format, t)).toBe(
      "March 2022 - June 2022 (4 mths)",
    );
    expect(formatPeriod({ start: "2022-07", end: "2026-05" }, format, t)).toBe(
      "July 2022 - May 2026 (3 yrs 11 mths)",
    );
  });

  it("keeps year-only values verbatim in ranges, without a duration", () => {
    expect(formatPeriod({ start: "2020", end: "2022" }, format, t)).toBe(
      "2020 - 2022",
    );
  });

  it("supports year-only ongoing periods, without a duration", () => {
    expect(formatPeriod({ start: "2020" }, format, t, now)).toBe("Since 2020");
  });

  it("localizes month names, the since template, and duration units per locale", () => {
    const fr = makeHelpers("fr", frMessages as typeof enMessages);
    // Intl fr joins numbers and units with a no-break space (U+00A0).
    expect(formatPeriod({ start: "2022-07" }, fr.format, fr.t, now)).toBe(
      "Depuis juillet 2022 (4\u00a0ans)",
    );
    expect(
      formatPeriod({ start: "2022-09", end: "2023-08" }, fr.format, fr.t),
    ).toBe("septembre 2022 - août 2023 (1\u00a0an)");
  });
});

describe("comparePeriodsDesc", () => {
  it("sorts ongoing periods before ended ones", () => {
    const ongoing = { start: "2022-07" };
    const ended = { start: "2022-07", end: "2026-05" };
    expect(comparePeriodsDesc(ongoing, ended)).toBeLessThan(0);
    expect(comparePeriodsDesc(ended, ongoing)).toBeGreaterThan(0);
  });

  it("sorts ended periods by most recent end first", () => {
    const recent = { start: "2022-09", end: "2023-08" };
    const older = { start: "2022-03", end: "2022-06" };
    expect(comparePeriodsDesc(recent, older)).toBeLessThan(0);
    expect(comparePeriodsDesc(older, recent)).toBeGreaterThan(0);
  });

  it("breaks ties by most recent start first", () => {
    const laterStart = { start: "2022-09", end: "2023-08" };
    const earlierStart = { start: "2022-03", end: "2023-08" };
    expect(comparePeriodsDesc(laterStart, earlierStart)).toBeLessThan(0);
    expect(
      comparePeriodsDesc({ start: "2024" }, { start: "2020" }),
    ).toBeLessThan(0);
  });

  it("orders a mixed list ongoing-first then by recency", () => {
    const list = [
      { start: "2022-07", end: "2026-05" },
      { start: "2022-07" },
      { start: "2022-09", end: "2023-08" },
      { start: "2022-03", end: "2022-06" },
    ];
    expect([...list].sort(comparePeriodsDesc)).toEqual([
      { start: "2022-07" },
      { start: "2022-07", end: "2026-05" },
      { start: "2022-09", end: "2023-08" },
      { start: "2022-03", end: "2022-06" },
    ]);
  });
});

describe("completedYearsSince", () => {
  // June 2026, mid-month — deterministic "now".
  const now = new Date(Date.UTC(2026, 5, 15));

  it("floors to whole elapsed years from a YYYY-MM start", () => {
    expect(completedYearsSince("2022-03", now)).toBe(4);
  });

  it("does not count the current year before the anniversary month", () => {
    // July is after June, so the 4th year has not completed yet.
    expect(completedYearsSince("2022-07", now)).toBe(3);
  });

  it("counts the year once the anniversary month is reached", () => {
    expect(completedYearsSince("2022-06", now)).toBe(4);
  });

  it("treats a YYYY-only start as January", () => {
    expect(completedYearsSince("2020", now)).toBe(6);
  });

  it("never returns a negative count for a future start", () => {
    expect(completedYearsSince("2030-01", now)).toBe(0);
  });

  it("returns 0 for an unparseable start", () => {
    expect(completedYearsSince("not-a-date", now)).toBe(0);
  });
});
