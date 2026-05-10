import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@react-pdf/renderer", () => ({
  renderToBuffer: vi.fn(async () => Buffer.from("fake-pdf-bytes")),
  // The CVDocument module imports a bunch of styles/fonts from this package;
  // stub the bits CVDocument touches so it can be imported without crashing.
  Document: ({ children }: { children?: unknown }) => children,
  Page: ({ children }: { children?: unknown }) => children,
  View: ({ children }: { children?: unknown }) => children,
  Text: ({ children }: { children?: unknown }) => children,
  Link: ({ children }: { children?: unknown }) => children,
  StyleSheet: { create: <T,>(styles: T) => styles },
  Font: { register: vi.fn() },
}));

vi.mock("@/components/cv-pdf/CVDocument", () => ({
  CVDocument: () => null,
}));

vi.mock("@/lib/cv/cv-pdf.data", () => ({
  getCvData: vi.fn(async () => ({ name: "Alexandre" })),
  buildCvFileName: (locale: string) => `alexandre-gossard-cv-${locale}.pdf`,
}));

vi.mock("@/lib/cv/cv-pdf.fonts", () => ({
  renderWithCvFonts: vi.fn(
    async (_locale: string, _data: unknown, render: () => Promise<Buffer>) =>
      await render(),
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetModules();
});

async function loadRoute() {
  return await import("@/app/api/cv/route");
}

describe("/api/cv GET", () => {
  it("returns a PDF response inline by default", async () => {
    const { GET } = await loadRoute();
    const res = await GET(new Request("https://example.com/api/cv"));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(res.headers.get("Content-Disposition")).toContain("inline");
    expect(res.headers.get("Cache-Control")).toContain("max-age=3600");
  });

  it("uses attachment disposition when ?download=1", async () => {
    const { GET } = await loadRoute();
    const res = await GET(new Request("https://example.com/api/cv?download=1"));
    expect(res.headers.get("Content-Disposition")).toContain("attachment");
  });

  it("picks the locale from the lang query parameter", async () => {
    const { GET } = await loadRoute();
    const res = await GET(new Request("https://example.com/api/cv?lang=fr"));
    expect(res.headers.get("Content-Language")).toBe("fr");
    expect(res.headers.get("Content-Disposition")).toContain(
      "alexandre-gossard-cv-fr.pdf",
    );
  });

  it("falls back to Accept-Language header when no query lang", async () => {
    const { GET } = await loadRoute();
    const res = await GET(
      new Request("https://example.com/api/cv", {
        headers: { "accept-language": "es-ES,es;q=0.9,en;q=0.8" },
      }),
    );
    expect(res.headers.get("Content-Language")).toBe("es");
  });

  it("falls back to default locale when nothing matches", async () => {
    const { GET } = await loadRoute();
    const res = await GET(
      new Request("https://example.com/api/cv", {
        headers: { "accept-language": "xx" },
      }),
    );
    expect(res.headers.get("Content-Language")).toBe("en");
  });

  it("ignores unknown lang query parameters and falls back", async () => {
    const { GET } = await loadRoute();
    const res = await GET(
      new Request("https://example.com/api/cv?lang=zz", {
        headers: { "accept-language": "fr" },
      }),
    );
    expect(res.headers.get("Content-Language")).toBe("fr");
  });
});
