import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  extractCountry,
  extractIpAddress,
  hashIpAddress,
  isBotUserAgent,
} from "@/lib/utils/request.utils";

function makeRequest(headers: Record<string, string>): Request {
  return new Request("https://example.com", { headers });
}

describe("extractIpAddress", () => {
  it("returns the first IP from x-forwarded-for", () => {
    expect(
      extractIpAddress(makeRequest({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" })),
    ).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    expect(extractIpAddress(makeRequest({ "x-real-ip": "9.9.9.9" }))).toBe(
      "9.9.9.9",
    );
  });

  it("returns null when no IP headers are present", () => {
    expect(extractIpAddress(makeRequest({}))).toBeNull();
  });

  it("trims whitespace", () => {
    expect(
      extractIpAddress(makeRequest({ "x-forwarded-for": "  4.4.4.4  " })),
    ).toBe("4.4.4.4");
  });
});

describe("hashIpAddress", () => {
  const ORIGINAL_SALT = process.env.APP_IP_SALT;

  beforeEach(() => {
    process.env.APP_IP_SALT = "test-salt";
  });

  afterEach(() => {
    process.env.APP_IP_SALT = ORIGINAL_SALT;
  });

  it("returns null for null input", () => {
    expect(hashIpAddress(null)).toBeNull();
  });

  it("returns a 64-char hex digest", () => {
    const hash = hashIpAddress("1.2.3.4");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("is deterministic with the same salt", () => {
    expect(hashIpAddress("1.2.3.4")).toBe(hashIpAddress("1.2.3.4"));
  });

  it("changes when the salt changes", () => {
    const a = hashIpAddress("1.2.3.4");
    process.env.APP_IP_SALT = "different-salt";
    expect(hashIpAddress("1.2.3.4")).not.toBe(a);
  });
});

describe("extractCountry", () => {
  it("returns x-vercel-ip-country first", () => {
    expect(
      extractCountry(
        makeRequest({
          "x-vercel-ip-country": "FR",
          "cf-ipcountry": "US",
        }),
      ),
    ).toBe("FR");
  });

  it("falls back to cf-ipcountry", () => {
    expect(extractCountry(makeRequest({ "cf-ipcountry": "DE" }))).toBe("DE");
  });

  it("returns null when no country header is present", () => {
    expect(extractCountry(makeRequest({}))).toBeNull();
  });
});

describe("isBotUserAgent", () => {
  it("treats null/undefined/empty UA as a bot", () => {
    expect(isBotUserAgent(null)).toBe(true);
    expect(isBotUserAgent(undefined)).toBe(true);
    expect(isBotUserAgent("")).toBe(true);
  });

  it("flags known bot patterns", () => {
    expect(isBotUserAgent("Googlebot/2.1")).toBe(true);
    expect(isBotUserAgent("facebookexternalhit/1.1")).toBe(true);
    expect(isBotUserAgent("python-requests/2.31")).toBe(true);
    expect(isBotUserAgent("HeadlessChrome/120")).toBe(true);
    expect(isBotUserAgent("curl/8.5.0")).toBe(true);
  });

  it("does not flag a normal browser UA", () => {
    const chrome =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
    expect(isBotUserAgent(chrome)).toBe(false);
  });

  it("does not flag a Firefox UA", () => {
    const firefox =
      "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0";
    expect(isBotUserAgent(firefox)).toBe(false);
  });
});
