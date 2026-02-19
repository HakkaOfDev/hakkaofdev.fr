import type { PostgrestError } from "@supabase/supabase-js";
import {
  GUESTBOOK_CONFIG,
  GUESTBOOK_ERRORS,
  HONEYPOT_MAX_LENGTH,
  RATE_LIMIT_WINDOW_MS,
} from "@/lib/constants/guestbook.constants";
import { supabase } from "@/lib/supabase";
import { parsePositiveInt } from "@/lib/utils/number.utils";
import { cleanText, codepointLength } from "@/lib/utils/string.utils";
import { normalizeWebsite } from "@/lib/utils/url.utils";
import type {
  GuestbookCountriesResult,
  GuestbookCreateInput,
  GuestbookCreateMeta,
  GuestbookCreateResult,
  GuestbookListOptions,
  GuestbookListResult,
} from "@/types/guestbook";

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
    error: GUESTBOOK_ERRORS.SCHEMA_MISSING,
    httpStatus: 503,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

async function listEntries(
  options?: GuestbookListOptions,
): Promise<GuestbookListResult> {
  if (!supabase) {
    return {
      ok: false,
      error: GUESTBOOK_ERRORS.UNAVAILABLE,
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
      error: GUESTBOOK_ERRORS.FETCH_ENTRIES_FAILED,
      httpStatus: 500,
    };
  }

  return { ok: true, entries: data ?? [] };
}

async function listCountries(): Promise<GuestbookCountriesResult> {
  if (!supabase) {
    return {
      ok: false,
      error: GUESTBOOK_ERRORS.UNAVAILABLE,
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
      error: GUESTBOOK_ERRORS.FETCH_COUNTRIES_FAILED,
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

async function createEntry(
  body: GuestbookCreateInput,
  meta: GuestbookCreateMeta,
): Promise<GuestbookCreateResult> {
  if (!supabase) {
    return {
      ok: false,
      error: GUESTBOOK_ERRORS.UNAVAILABLE,
      httpStatus: 503,
    };
  }

  const honeypot = cleanText(body.company, HONEYPOT_MAX_LENGTH);
  if (honeypot) return { ok: true, status: "published" };

  const name = cleanText(body.name, MAX_NAME_LENGTH);
  const message = cleanText(body.message, MAX_MESSAGE_LENGTH);
  const websiteInput = cleanText(body.website, MAX_WEBSITE_LENGTH);
  const website = normalizeWebsite(websiteInput);

  if (codepointLength(name) < 2) {
    return {
      ok: false,
      error: GUESTBOOK_ERRORS.NAME_TOO_SHORT,
      httpStatus: 400,
    };
  }
  if (codepointLength(message) < 2) {
    return {
      ok: false,
      error: GUESTBOOK_ERRORS.MESSAGE_TOO_SHORT,
      httpStatus: 400,
    };
  }
  if (websiteInput && !website) {
    return {
      ok: false,
      error: GUESTBOOK_ERRORS.WEBSITE_INVALID,
      httpStatus: 400,
    };
  }

  const rateLimitMaxPerHour = parsePositiveInt(
    process.env.GUESTBOOK_RATE_LIMIT_MAX_PER_HOUR ?? null,
    DEFAULT_RATE_LIMIT_MAX_PER_HOUR,
  );
  const autoApprove = isAutoApproveEnabled();

  if (meta.ipHash) {
    const oneHourAgo = new Date(
      Date.now() - RATE_LIMIT_WINDOW_MS,
    ).toISOString();

    const { count, error: countError } = await supabase
      .from("guestbook_entries")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", meta.ipHash)
      .gte("created_at", oneHourAgo);

    if (countError) {
      if (isGuestbookSchemaMissing(countError)) return schemaMissingError();
      return {
        ok: false,
        error: GUESTBOOK_ERRORS.RATE_LIMIT_CHECK_FAILED,
        httpStatus: 500,
      };
    }

    if ((count ?? 0) >= rateLimitMaxPerHour) {
      return {
        ok: false,
        error: GUESTBOOK_ERRORS.RATE_LIMIT_EXCEEDED,
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
      error: GUESTBOOK_ERRORS.SAVE_FAILED,
      httpStatus: 500,
    };
  }

  return { ok: true, status: autoApprove ? "published" : "pending_moderation" };
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const GuestbookService = {
  listEntries,
  listCountries,
  createEntry,
} as const;
