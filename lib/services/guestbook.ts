import { createHash } from "node:crypto";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { GUESTBOOK_CONFIG } from "@/lib/constants/guestbook.constants";
import type {
  GuestbookCreateInput,
  GuestbookCreateResult,
  GuestbookListResult,
} from "../types/guestbook";

const {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_RATE_LIMIT_MAX_PER_HOUR,
  MAX_NAME_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_WEBSITE_LENGTH,
  MAX_USER_AGENT_LENGTH,
} = GUESTBOOK_CONFIG;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function codepointLength(str: string) {
  return [...str].length;
}

function cleanText(input: unknown, maxLength: number) {
  if (typeof input !== "string") return "";
  const cleaned = input.trim().replace(/\s+/g, " ");
  return [...cleaned].slice(0, maxLength).join("");
}

function normalizeWebsite(input: string) {
  if (!input) return null;

  const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const num = Number.parseInt(value, 10);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return num;
}

function isAutoApproveEnabled() {
  const value = process.env.GUESTBOOK_AUTO_APPROVE?.trim().toLowerCase();
  return value !== "false";
}

function isGuestbookSchemaMissing(error: PostgrestError | null) {
  return error?.code === "42P01";
}

function schemaMissingError(): GuestbookListResult & { ok: false } {
  return {
    ok: false,
    error: "Guestbook is not initialized. Run supabase/schema/guestbook.sql.",
    httpStatus: 503,
  };
}

// ─── IP Hashing ──────────────────────────────────────────────────────────────

export function extractIpAddress(request: Request) {
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || null;
}

export function hashIpAddress(ip: string | null) {
  if (!ip) return null;

  const salt = process.env.APP_IP_SALT?.trim() ?? "";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

export function extractCountry(request: Request) {
  return (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    null
  );
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function listEntries(options?: {
  limit?: number;
  sort?: "asc" | "desc";
  country?: string;
}): Promise<GuestbookListResult> {
  if (!supabase) {
    return {
      ok: false,
      error: "Guestbook service is unavailable.",
      httpStatus: 503,
    };
  }

  const effectiveLimit = Math.min(
    parsePositiveInt(
      String(options?.limit ?? DEFAULT_PAGE_SIZE),
      DEFAULT_PAGE_SIZE,
    ),
    MAX_PAGE_SIZE,
  );

  let query = supabase
    .from("guestbook_entries")
    .select("id,name,message,website,country,created_at")
    .eq("approved", true);

  if (options?.country) {
    query = query.eq("country", options.country.toUpperCase());
  }

  query = query
    .order("created_at", { ascending: options?.sort === "asc" })
    .limit(effectiveLimit);

  const { data, error } = await query;

  if (error) {
    if (isGuestbookSchemaMissing(error)) return schemaMissingError();
    return {
      ok: false,
      error: "Failed to fetch guestbook entries.",
      httpStatus: 500,
    };
  }

  return { ok: true, entries: data ?? [] };
}

export type GuestbookCountriesResult =
  | { ok: true; countries: string[] }
  | { ok: false; error: string; httpStatus: number };

export async function listCountries(): Promise<GuestbookCountriesResult> {
  if (!supabase) {
    return {
      ok: false,
      error: "Guestbook service is unavailable.",
      httpStatus: 503,
    };
  }

  const { data, error } = await supabase
    .from("guestbook_entries")
    .select("country")
    .eq("approved", true)
    .not("country", "is", null);

  if (error) {
    if (isGuestbookSchemaMissing(error)) return schemaMissingError();
    return {
      ok: false,
      error: "Failed to fetch countries.",
      httpStatus: 500,
    };
  }

  const unique = [
    ...new Set(
      (data ?? [])
        .map((row: { country: string | null }) => row.country)
        .filter(Boolean) as string[],
    ),
  ].sort();

  return { ok: true, countries: unique };
}

export async function createEntry(
  body: GuestbookCreateInput,
  meta: {
    ipHash: string | null;
    userAgent: string | null;
    country: string | null;
  },
): Promise<GuestbookCreateResult> {
  if (!supabase) {
    return {
      ok: false,
      error: "Guestbook service is unavailable.",
      httpStatus: 503,
    };
  }

  const honeypot = cleanText(body.company, 100);
  if (honeypot) return { ok: true, status: "published" };

  const name = cleanText(body.name, MAX_NAME_LENGTH);
  const message = cleanText(body.message, MAX_MESSAGE_LENGTH);
  const websiteInput = cleanText(body.website, MAX_WEBSITE_LENGTH);
  const website = normalizeWebsite(websiteInput);

  if (codepointLength(name) < 2) {
    return {
      ok: false,
      error: "Name must be at least 2 characters.",
      httpStatus: 400,
    };
  }
  if (codepointLength(message) < 2) {
    return {
      ok: false,
      error: "Message must be at least 2 characters.",
      httpStatus: 400,
    };
  }
  if (websiteInput && !website) {
    return { ok: false, error: "Website URL is invalid.", httpStatus: 400 };
  }

  const rateLimitMaxPerHour = parsePositiveInt(
    process.env.GUESTBOOK_RATE_LIMIT_MAX_PER_HOUR ?? null,
    DEFAULT_RATE_LIMIT_MAX_PER_HOUR,
  );
  const autoApprove = isAutoApproveEnabled();

  if (meta.ipHash) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabase
      .from("guestbook_entries")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", meta.ipHash)
      .gte("created_at", oneHourAgo);

    if (countError) {
      if (isGuestbookSchemaMissing(countError)) return schemaMissingError();
      return { ok: false, error: "Rate limit check failed.", httpStatus: 500 };
    }

    if ((count ?? 0) >= rateLimitMaxPerHour) {
      return {
        ok: false,
        error: "Rate limit exceeded. Please try again later.",
        httpStatus: 429,
      };
    }
  }

  const { error: insertError } = await supabase
    .from("guestbook_entries")
    .insert({
      name,
      message,
      website,
      approved: autoApprove,
      country: meta.country,
      ip_hash: meta.ipHash,
      user_agent: cleanText(meta.userAgent, MAX_USER_AGENT_LENGTH),
    });

  if (insertError) {
    if (isGuestbookSchemaMissing(insertError)) return schemaMissingError();
    return {
      ok: false,
      error: "Failed to save guestbook entry.",
      httpStatus: 500,
    };
  }

  return { ok: true, status: autoApprove ? "published" : "pending_moderation" };
}
