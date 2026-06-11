import type { createFormatter } from "next-intl";

/**
 * A resume period. `start`/`end` are `"YYYY-MM"` (month precision,
 * locale-formatted) or `"YYYY"` (rendered verbatim). A missing `end`
 * means the position is ongoing.
 */
export type Period = {
  start: string;
  end?: string;
};

type IntlFormatter = ReturnType<typeof createFormatter>;
type PeriodTranslator = (key: "since", values: { date: string }) => string;

const MONTH_PRECISION = /^(\d{4})-(\d{2})$/;
const YEAR_OR_MONTH = /^(\d{4})(?:-(\d{2}))?$/;

/**
 * Whole completed years between a `"YYYY-MM"` (or `"YYYY"`, treated as January)
 * start and `now`, floored — March 2022 → June 2026 is 4. Returns 0 for a
 * future or unparseable start. Drives the dynamic "X+ years of experience"
 * figure surfaced in the CV summary and SEO metadata.
 */
export function completedYearsSince(
  start: string,
  now: Date = new Date(),
): number {
  const match = YEAR_OR_MONTH.exec(start);
  if (!match) return 0;
  const startYear = Number(match[1]);
  const startMonth = match[2] ? Number(match[2]) : 1;
  let years = now.getFullYear() - startYear;
  if (now.getMonth() + 1 < startMonth) years -= 1;
  return Math.max(0, years);
}

/**
 * Most-recent-first ordering: ongoing periods (no `end`) sort before ended
 * ones, then by `end` descending, then by `start` descending. `"YYYY"` and
 * `"YYYY-MM"` values compare correctly as plain strings.
 */
export function comparePeriodsDesc(a: Period, b: Period): number {
  if (!a.end || !b.end) {
    if (!a.end && !b.end) return b.start.localeCompare(a.start);
    return a.end ? 1 : -1;
  }
  return b.end.localeCompare(a.end) || b.start.localeCompare(a.start);
}

function formatPeriodDate(value: string, format: IntlFormatter): string {
  const match = MONTH_PRECISION.exec(value);
  if (!match) return value;
  // Mid-month UTC date so no formatter time zone can shift the rendered month.
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 15));
  return format.dateTime(date, { month: "long", year: "numeric" });
}

/**
 * LinkedIn-style inclusive month count (July 2022 - May 2026 → 47), or
 * `null` when either bound lacks month precision. Ongoing periods count
 * up to `now`.
 */
function countMonths(period: Period, now: Date): number | null {
  const start = MONTH_PRECISION.exec(period.start);
  if (!start) return null;
  let endYear: number;
  let endMonth: number;
  if (period.end) {
    const end = MONTH_PRECISION.exec(period.end);
    if (!end) return null;
    endYear = Number(end[1]);
    endMonth = Number(end[2]);
  } else {
    endYear = now.getFullYear();
    endMonth = now.getMonth() + 1;
  }
  return (endYear - Number(start[1])) * 12 + (endMonth - Number(start[2])) + 1;
}

function formatDuration(months: number, format: IntlFormatter): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) {
    parts.push(
      format.number(years, {
        style: "unit",
        unit: "year",
        unitDisplay: "short",
      }),
    );
  }
  if (rest > 0) {
    parts.push(
      format.number(rest, {
        style: "unit",
        unit: "month",
        unitDisplay: "short",
      }),
    );
  }
  return parts.join(" ");
}

export function formatPeriod(
  period: Period,
  format: IntlFormatter,
  t: PeriodTranslator,
  now: Date = new Date(),
): string {
  const start = formatPeriodDate(period.start, format);
  const base = period.end
    ? `${start} - ${formatPeriodDate(period.end, format)}`
    : t("since", { date: start });
  const months = countMonths(period, now);
  if (months === null || months < 1) return base;
  return `${base} (${formatDuration(months, format)})`;
}
