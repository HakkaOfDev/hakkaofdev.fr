import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: { rpc: (...args: unknown[]) => rpc(...args) },
}));

import { AnalyticsService } from "@/lib/services/analytics";

function row(host: string, unique_count: number) {
  return { host, unique_count, total_hits: unique_count };
}

beforeEach(() => {
  rpc.mockReset();
});

describe("AnalyticsService.getReferrerBreakdown", () => {
  it("hides the site's own apex and www hosts", async () => {
    rpc.mockResolvedValue({
      data: [
        row("hakkaofdev.fr", 907),
        row("www.google.com", 48),
        row("www.hakkaofdev.fr", 12),
        row("t.co", 11),
      ],
      error: null,
    });

    const result = await AnalyticsService.getReferrerBreakdown("all");

    expect(result?.map((r) => r.host)).toEqual(["www.google.com", "t.co"]);
  });

  it("over-fetches so the requested limit survives filtering", async () => {
    rpc.mockResolvedValue({
      data: [row("hakkaofdev.fr", 9), row("a.com", 3), row("b.com", 2)],
      error: null,
    });

    const result = await AnalyticsService.getReferrerBreakdown("7d", 2);

    expect(rpc).toHaveBeenCalledWith("get_visitor_referrers_range", {
      p_slug: null,
      p_days: 7,
      p_limit: 4,
    });
    expect(result?.map((r) => r.host)).toEqual(["a.com", "b.com"]);
  });
});
