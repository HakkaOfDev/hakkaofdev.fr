import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CStatsOverview } from "@/components/commands/renders/stats/CStatsOverview";
import messages from "@/messages/en.json";
import type { StatsRange } from "@/types/analytics";
import type { StatsData, WakaTimeStats } from "@/types/stats";

const getStats = vi.fn();

vi.mock("@/app/actions", () => ({
  getStats: (range: StatsRange) => getStats(range),
}));

vi.mock("@/components/providers/PipelineProvider", () => ({
  useGrep: () => null,
  useGrepRaw: () => null,
}));

function statsWith(wakatime: Partial<WakaTimeStats>): StatsData {
  return {
    wakatime: {
      codingTime: null,
      dailyAverage: null,
      topLanguage: null,
      calculatingPercent: null,
      ...wakatime,
    },
    totalStars: 10,
    contributions: 100,
    codingSince: 2019,
    visitors: 42,
  };
}

function renderOverview(range: StatsRange) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="en" messages={messages}>
        <CStatsOverview range={range} />
      </NextIntlClientProvider>
    </QueryClientProvider>,
  );
}

/** The value rendered under a stat card's label. */
async function cardValue(label: string) {
  const labelEl = await screen.findByText(label);
  return labelEl.nextElementSibling?.textContent;
}

beforeEach(() => {
  getStats.mockReset();
});

describe("CStatsOverview WakaTime cards", () => {
  it("passes the selected range to the stats action", async () => {
    getStats.mockResolvedValue(statsWith({ codingTime: "3 hrs" }));
    renderOverview("7d");
    await screen.findByText("Coding Time (range)");
    expect(getStats).toHaveBeenCalledWith("7d");
  });

  it("shows all-time labels and values", async () => {
    getStats.mockResolvedValue(
      statsWith({ codingTime: "5,049 hrs", topLanguage: "TypeScript (57%)" }),
    );
    renderOverview("all");
    expect(await cardValue("Total Coding Time")).toBe("5,049 hrs");
    expect(await cardValue("Top Language")).toBe("TypeScript (57%)");
  });

  it("shows progress while WakaTime is still calculating", async () => {
    getStats.mockResolvedValue(statsWith({ calculatingPercent: 36 }));
    renderOverview("all");
    expect(await cardValue("Total Coding Time")).toBe("Calculating… 36%");
    expect(await cardValue("Top Language")).toBe("Calculating… 36%");
  });

  it("says 'No activity' for an empty ranged window", async () => {
    getStats.mockResolvedValue(statsWith({ codingTime: "0 secs" }));
    renderOverview("30d");
    expect(await cardValue("Coding Time (range)")).toBe("0 secs");
    expect(await cardValue("Top Language")).toBe("No activity");
  });

  it("falls back to N/A when WakaTime is unavailable", async () => {
    getStats.mockResolvedValue(statsWith({}));
    renderOverview("30d");
    expect(await cardValue("Coding Time (range)")).toBe("N/A");
    expect(await cardValue("Top Language")).toBe("N/A");
  });
});
