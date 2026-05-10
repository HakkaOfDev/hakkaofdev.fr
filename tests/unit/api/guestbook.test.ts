import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GUESTBOOK_ERRORS } from "@/lib/constants/guestbook.constants";

const guestbookMock = {
  listEntries: vi.fn(),
  listCountries: vi.fn(),
  createEntry: vi.fn(),
};

vi.mock("@/lib/services", () => ({
  GuestbookService: guestbookMock,
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => `t(${key})`),
}));

beforeEach(() => {
  guestbookMock.listEntries.mockReset();
  guestbookMock.listCountries.mockReset();
  guestbookMock.createEntry.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

async function loadRoute() {
  return await import("@/app/api/guestbook/route");
}

async function loadCountriesRoute() {
  return await import("@/app/api/guestbook/countries/route");
}

function makeRequest(
  url: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
) {
  return new Request(url, init);
}

describe("GET /api/guestbook", () => {
  it("returns 200 and the entries when service succeeds", async () => {
    guestbookMock.listEntries.mockResolvedValue({
      ok: true,
      entries: [
        {
          id: "1",
          name: "Alice",
          message: "Hi",
          website: null,
          country: "FR",
          created_at: "2026-01-01",
        },
      ],
    });

    const { GET } = await loadRoute();
    const res = await GET(makeRequest("https://example.com/api/guestbook"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.entries).toHaveLength(1);
  });

  it("forwards limit/sort/country query parameters", async () => {
    guestbookMock.listEntries.mockResolvedValue({ ok: true, entries: [] });
    const { GET } = await loadRoute();
    await GET(
      makeRequest(
        "https://example.com/api/guestbook?limit=10&sort=asc&country=FR",
      ),
    );
    expect(guestbookMock.listEntries).toHaveBeenCalledWith({
      limit: 10,
      sort: "asc",
      country: "FR",
    });
  });

  it("returns the service status code on failure", async () => {
    guestbookMock.listEntries.mockResolvedValue({
      ok: false,
      error: GUESTBOOK_ERRORS.UNAVAILABLE,
      httpStatus: 503,
    });
    const { GET } = await loadRoute();
    const res = await GET(makeRequest("https://example.com/api/guestbook"));
    expect(res.status).toBe(503);
  });

  it("picks locale from Accept-Language", async () => {
    guestbookMock.listEntries.mockResolvedValue({ ok: true, entries: [] });
    const { GET } = await loadRoute();
    const res = await GET(
      makeRequest("https://example.com/api/guestbook", {
        headers: { "accept-language": "fr-FR,fr;q=0.9,en;q=0.8" },
      }),
    );
    expect(res.headers.get("Content-Language")).toBe("fr");
  });

  it("falls back to default locale when Accept-Language is unknown", async () => {
    guestbookMock.listEntries.mockResolvedValue({ ok: true, entries: [] });
    const { GET } = await loadRoute();
    const res = await GET(
      makeRequest("https://example.com/api/guestbook", {
        headers: { "accept-language": "xx" },
      }),
    );
    expect(res.headers.get("Content-Language")).toBe("en");
  });
});

describe("POST /api/guestbook", () => {
  it("returns 400 for invalid JSON", async () => {
    const { POST } = await loadRoute();
    const req = new Request("https://example.com/api/guestbook", {
      method: "POST",
      body: "not json",
      headers: { "content-type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 when service publishes the entry", async () => {
    guestbookMock.createEntry.mockResolvedValue({
      ok: true,
      status: "published",
    });

    const { POST } = await loadRoute();
    const req = new Request("https://example.com/api/guestbook", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Alice", message: "Hi" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true, status: "published" });
  });

  it("forwards meta (ipHash + country + userAgent) from headers", async () => {
    guestbookMock.createEntry.mockResolvedValue({
      ok: true,
      status: "published",
    });
    process.env.APP_IP_SALT = "test-salt";

    const { POST } = await loadRoute();
    const req = new Request("https://example.com/api/guestbook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0",
        "x-forwarded-for": "1.2.3.4",
        "x-vercel-ip-country": "FR",
      },
      body: JSON.stringify({ name: "Alice", message: "Hi" }),
    });
    await POST(req);

    expect(guestbookMock.createEntry).toHaveBeenCalledWith(
      { name: "Alice", message: "Hi" },
      expect.objectContaining({
        userAgent: "Mozilla/5.0",
        country: "FR",
      }),
    );
    const meta = guestbookMock.createEntry.mock.calls[0][1];
    expect(meta.ipHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("returns the service status code on failure", async () => {
    guestbookMock.createEntry.mockResolvedValue({
      ok: false,
      error: GUESTBOOK_ERRORS.RATE_LIMIT_EXCEEDED,
      httpStatus: 429,
    });

    const { POST } = await loadRoute();
    const res = await POST(
      new Request("https://example.com/api/guestbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Alice", message: "Hi" }),
      }),
    );
    expect(res.status).toBe(429);
  });
});

describe("GET /api/guestbook/countries", () => {
  it("returns 200 with the country list", async () => {
    guestbookMock.listCountries.mockResolvedValue({
      ok: true,
      countries: ["FR", "US"],
    });
    const { GET } = await loadCountriesRoute();
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ countries: ["FR", "US"] });
  });

  it("forwards the service status code on failure", async () => {
    guestbookMock.listCountries.mockResolvedValue({
      ok: false,
      error: GUESTBOOK_ERRORS.SCHEMA_MISSING,
      httpStatus: 503,
    });
    const { GET } = await loadCountriesRoute();
    const res = await GET();
    expect(res.status).toBe(503);
  });
});
