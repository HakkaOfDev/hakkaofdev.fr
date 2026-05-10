import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const supabaseRef: { client: unknown } = { client: null };

vi.mock("@/lib/supabase", () => ({
  get supabase() {
    return supabaseRef.client;
  },
}));

beforeEach(() => {
  vi.resetModules();
  supabaseRef.client = null;
  delete process.env.GUESTBOOK_AUTO_APPROVE;
  delete process.env.GUESTBOOK_RATE_LIMIT_MAX_PER_HOUR;
});

afterEach(() => {
  vi.clearAllMocks();
});

async function loadService() {
  const mod = await import("@/lib/services/guestbook");
  return mod.GuestbookService;
}

describe("GuestbookService.createEntry", () => {
  it("returns 503 when supabase is not configured", async () => {
    const svc = await loadService();
    const result = await svc.createEntry(
      { name: "Alice", message: "hello" },
      { ipHash: null, userAgent: null, country: null },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.httpStatus).toBe(503);
  });

  it("treats a non-empty honeypot as a silent success", async () => {
    supabaseRef.client = {
      from: vi.fn(() => {
        throw new Error("should not be called");
      }),
    };
    const svc = await loadService();
    const result = await svc.createEntry(
      { name: "Alice", message: "hi", company: "spammer" },
      { ipHash: null, userAgent: null, country: null },
    );
    expect(result).toEqual({ ok: true, status: "published" });
  });

  it("rejects too-short name", async () => {
    supabaseRef.client = { from: vi.fn() };
    const svc = await loadService();
    const result = await svc.createEntry(
      { name: "A", message: "hello" },
      { ipHash: null, userAgent: null, country: null },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.httpStatus).toBe(400);
  });

  it("rejects too-short message", async () => {
    supabaseRef.client = { from: vi.fn() };
    const svc = await loadService();
    const result = await svc.createEntry(
      { name: "Alice", message: "x" },
      { ipHash: null, userAgent: null, country: null },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.httpStatus).toBe(400);
  });

  it("rejects an invalid website URL", async () => {
    supabaseRef.client = { from: vi.fn() };
    const svc = await loadService();
    const result = await svc.createEntry(
      { name: "Alice", message: "hello", website: "not a url://!!!" },
      { ipHash: null, userAgent: null, country: null },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.httpStatus).toBe(400);
  });

  it("inserts the entry on success", async () => {
    const insert = vi.fn(async () => ({ error: null }));
    supabaseRef.client = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockResolvedValue({ count: 0, error: null }),
        insert,
      })),
    };

    const svc = await loadService();
    const result = await svc.createEntry(
      { name: "Alice", message: "hello world" },
      { ipHash: "ip-hash", userAgent: "ua", country: "FR" },
    );

    expect(result.ok).toBe(true);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Alice",
        message: "hello world",
        approved: true,
        country: "FR",
        ip_hash: "ip-hash",
      }),
    );
  });

  it("returns 429 when rate-limited", async () => {
    supabaseRef.client = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockResolvedValue({ count: 99, error: null }),
        insert: vi.fn(),
      })),
    };

    const svc = await loadService();
    const result = await svc.createEntry(
      { name: "Alice", message: "hello world" },
      { ipHash: "ip-hash", userAgent: null, country: null },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.httpStatus).toBe(429);
  });
});
