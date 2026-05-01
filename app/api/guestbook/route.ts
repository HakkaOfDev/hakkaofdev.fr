import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { GUESTBOOK_ERRORS } from "@/lib/constants/guestbook.constants";
import { GuestbookService } from "@/lib/services";
import {
  extractCountry,
  extractIpAddress,
  hashIpAddress,
} from "@/lib/utils/request.utils";
import type { GuestbookCreateInput } from "@/types/guestbook";

export const runtime = "nodejs";

function pickLocale(request: Request): Locale {
  const accept = request.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const tag = part.trim().split(";")[0]?.split("-")[0];
    if (tag && hasLocale(routing.locales, tag)) return tag;
  }
  return routing.defaultLocale;
}

/**
 * Maps the service's English error strings to message-file keys under
 * `Guestbook.api.errors.{key}`. Anything that isn't in the map (e.g. a
 * future error variant) is forwarded verbatim — better than hiding the
 * detail behind a generic translation.
 */
const ERROR_KEY_BY_STRING: Record<string, string> = {
  [GUESTBOOK_ERRORS.SCHEMA_MISSING]: "schemaMissing",
  [GUESTBOOK_ERRORS.UNAVAILABLE]: "unavailable",
  [GUESTBOOK_ERRORS.FETCH_ENTRIES_FAILED]: "fetchEntriesFailed",
  [GUESTBOOK_ERRORS.FETCH_COUNTRIES_FAILED]: "fetchCountriesFailed",
  [GUESTBOOK_ERRORS.SAVE_FAILED]: "saveFailed",
  [GUESTBOOK_ERRORS.RATE_LIMIT_CHECK_FAILED]: "rateLimitCheckFailed",
  [GUESTBOOK_ERRORS.RATE_LIMIT_EXCEEDED]: "rateLimitExceeded",
  [GUESTBOOK_ERRORS.NAME_TOO_SHORT]: "nameTooShort",
  [GUESTBOOK_ERRORS.MESSAGE_TOO_SHORT]: "messageTooShort",
  [GUESTBOOK_ERRORS.WEBSITE_INVALID]: "websiteInvalid",
};

async function translateError(
  errorString: string | undefined,
  locale: Locale,
): Promise<string> {
  if (!errorString) return GUESTBOOK_ERRORS.UNAVAILABLE;
  const key = ERROR_KEY_BY_STRING[errorString];
  if (!key) return errorString;
  const t = await getTranslations({
    locale,
    namespace: "Guestbook.api.errors",
  });
  // biome-ignore lint/suspicious/noExplicitAny: dynamic key from a closed-set map
  return t(key as any);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : undefined;
  const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";
  const country = searchParams.get("country") || undefined;
  const locale = pickLocale(request);

  const result = await GuestbookService.listEntries({ limit, sort, country });

  if (!result.ok) {
    return Response.json(
      { error: await translateError(result.error, locale) },
      {
        status: result.httpStatus,
        headers: { "Content-Language": locale },
      },
    );
  }

  return Response.json(
    { entries: result.entries },
    { headers: { "Content-Language": locale } },
  );
}

export async function POST(request: Request) {
  const locale = pickLocale(request);
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    const t = await getTranslations({
      locale,
      namespace: "Guestbook.api.errors",
    });
    return Response.json(
      { error: t("invalidJsonPayload") },
      { status: 400, headers: { "Content-Language": locale } },
    );
  }

  const ipHash = hashIpAddress(extractIpAddress(request));
  const userAgent = request.headers.get("user-agent");
  const country = extractCountry(request);

  const result = await GuestbookService.createEntry(
    body as GuestbookCreateInput,
    {
      ipHash,
      userAgent,
      country,
    },
  );

  if (!result.ok) {
    return Response.json(
      { error: await translateError(result.error, locale) },
      {
        status: result.httpStatus,
        headers: { "Content-Language": locale },
      },
    );
  }

  return Response.json(
    { ok: true, status: result.status },
    { status: 201, headers: { "Content-Language": locale } },
  );
}
