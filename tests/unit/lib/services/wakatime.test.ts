import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WakaTimeService } from "@/lib/services/wakatime";

const fetchMock = vi.fn();

function jsonResponse(body: unknown, status = 200) {
  return { ok: true, status, json: async () => body };
}

/** Routes mocked WakaTime requests by path; the user endpoint returns `timezone`. */
function mockApi(
  routes: Record<string, unknown>,
  timezone: string | undefined = "Europe/Paris",
) {
  fetchMock.mockImplementation(async (url: string) => {
    const { pathname } = new URL(url);
    if (pathname === "/api/v1/users/current") {
      return jsonResponse({ data: { timezone } });
    }
    const key = pathname.replace("/api/v1/users/current/", "");
    if (!(key in routes)) throw new Error(`unexpected request: ${url}`);
    return jsonResponse(routes[key]);
  });
}

function summariesUrl(): URL {
  const call = fetchMock.mock.calls.find(([url]) =>
    (url as string).includes("/summaries"),
  );
  return new URL(call?.[0] as string);
}

const UP_TO_DATE = { is_up_to_date: true, percent_calculated: 100 };

beforeEach(() => {
  process.env.WAKATIME_API_KEY = "test-key";
  vi.stubGlobal("fetch", fetchMock);
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-29T12:00:00Z"));
});

afterEach(() => {
  delete process.env.WAKATIME_API_KEY;
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("WakaTimeService.getStats", () => {
  it("returns empty stats without an API key", async () => {
    delete process.env.WAKATIME_API_KEY;
    const stats = await WakaTimeService.getStats("7d");
    expect(stats).toEqual({
      codingTime: null,
      dailyAverage: null,
      topLanguage: null,
      calculatingPercent: null,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  describe("all-time range", () => {
    it("uses the all-time endpoints", async () => {
      mockApi({
        all_time_since_today: { data: { ...UP_TO_DATE, text: "5,049 hrs" } },
        "stats/all_time": {
          data: {
            ...UP_TO_DATE,
            human_readable_daily_average: "2 hrs",
            languages: [
              { name: "Other", percent: 60.1 },
              { name: "TypeScript", percent: 25.4 },
            ],
          },
        },
      });

      const stats = await WakaTimeService.getStats("all");

      expect(stats).toEqual({
        codingTime: "5,049 hrs",
        dailyAverage: "2 hrs",
        topLanguage: "TypeScript (25%)",
        calculatingPercent: null,
      });
    });

    it("reports progress instead of partial numbers while WakaTime computes", async () => {
      mockApi({
        all_time_since_today: {
          data: {
            is_up_to_date: false,
            percent_calculated: 36,
            text: "1,648 hrs",
          },
        },
        "stats/all_time": {
          data: {
            is_up_to_date: false,
            percent_calculated: 52,
            languages: [{ name: "JavaScript", percent: 70 }],
          },
        },
      });

      const stats = await WakaTimeService.getStats("all");

      expect(stats).toEqual({
        codingTime: null,
        dailyAverage: null,
        topLanguage: null,
        calculatingPercent: 36,
      });
    });

    it("stays pending if only one source is still computing", async () => {
      mockApi({
        all_time_since_today: { data: { ...UP_TO_DATE, text: "5,049 hrs" } },
        "stats/all_time": {
          data: { is_up_to_date: false, percent_calculated: 80 },
        },
      });

      const stats = await WakaTimeService.getStats("all");

      expect(stats.codingTime).toBeNull();
      expect(stats.calculatingPercent).toBe(80);
    });
  });

  describe("ranged windows", () => {
    it.each([
      ["today", "2026-09-29"],
      ["7d", "2026-09-23"],
      ["30d", "2026-08-31"],
      ["90d", "2026-07-02"],
    ] as const)("queries summaries for %s", async (range, start) => {
      mockApi({ summaries: { data: [] } });

      await WakaTimeService.getStats(range);

      const url = summariesUrl();
      expect(url.searchParams.get("start")).toBe(start);
      expect(url.searchParams.get("end")).toBe("2026-09-29");
    });

    it("computes dates in the account's timezone", async () => {
      vi.setSystemTime(new Date("2026-09-29T22:30:00Z"));
      mockApi({ summaries: { data: [] } });

      await WakaTimeService.getStats("today");

      expect(summariesUrl().searchParams.get("start")).toBe("2026-09-30");
      expect(summariesUrl().searchParams.get("end")).toBe("2026-09-30");
    });

    it("falls back to UTC for an unknown timezone", async () => {
      vi.setSystemTime(new Date("2026-09-29T22:30:00Z"));
      mockApi({ summaries: { data: [] } }, "Not/AZone");

      await WakaTimeService.getStats("today");

      expect(summariesUrl().searchParams.get("end")).toBe("2026-09-29");
    });

    it("aggregates the top language across days", async () => {
      mockApi({
        summaries: {
          cumulative_total: { text: "10 hrs" },
          daily_average: { text: "1 hr 25 mins" },
          data: [
            {
              languages: [
                { name: "TypeScript", total_seconds: 3000 },
                { name: "CSS", total_seconds: 1000 },
              ],
            },
            { languages: [{ name: "CSS", total_seconds: 2500 }] },
            { languages: [{ name: "TypeScript", total_seconds: 3500 }] },
          ],
        },
      });

      const stats = await WakaTimeService.getStats("7d");

      expect(stats).toEqual({
        codingTime: "10 hrs",
        dailyAverage: "1 hr 25 mins",
        topLanguage: "TypeScript (65%)",
        calculatingPercent: null,
      });
    });

    it("skips WakaTime's 'Other' bucket but keeps shares of all time", async () => {
      mockApi({
        summaries: {
          data: [
            {
              languages: [
                { name: "Other", total_seconds: 6000 },
                { name: "Markdown", total_seconds: 3000 },
                { name: "TypeScript", total_seconds: 1000 },
              ],
            },
          ],
        },
      });

      const stats = await WakaTimeService.getStats("7d");

      expect(stats.topLanguage).toBe("Markdown (30%)");
    });

    it("falls back to 'Other' when nothing else was tracked", async () => {
      mockApi({
        summaries: {
          data: [{ languages: [{ name: "Other", total_seconds: 600 }] }],
        },
      });

      const stats = await WakaTimeService.getStats("today");

      expect(stats.topLanguage).toBe("Other (100%)");
    });

    it("returns no top language when the window has no activity", async () => {
      mockApi({
        summaries: { cumulative_total: { text: "0 secs" }, data: [{}] },
      });

      const stats = await WakaTimeService.getStats("30d");

      expect(stats.codingTime).toBe("0 secs");
      expect(stats.topLanguage).toBeNull();
    });
  });
});
