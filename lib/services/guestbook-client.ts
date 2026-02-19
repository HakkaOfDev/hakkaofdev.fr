import {
  GUESTBOOK_API_PATHS,
  GUESTBOOK_DEFAULT_LIMIT,
} from "@/lib/constants/guestbook-client.constants";
import type {
  GuestbookApiError,
  GuestbookFilters,
  GuestbookListResponse,
} from "@/types/guestbook";

// ─── Fetchers ────────────────────────────────────────────────────────────────

async function fetchEntries(filters: GuestbookFilters) {
  const params = new URLSearchParams({
    limit: String(GUESTBOOK_DEFAULT_LIMIT),
    sort: filters.sort,
  });
  if (filters.country) params.set("country", filters.country);

  const response = await fetch(
    `${GUESTBOOK_API_PATHS.entries}?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const json = (await response.json()) as
    | GuestbookListResponse
    | GuestbookApiError;
  if (!response.ok) {
    throw new Error(
      "error" in json && json.error
        ? json.error
        : "Failed to fetch guestbook entries.",
    );
  }

  return (json as GuestbookListResponse).entries;
}

async function fetchCountries(): Promise<string[]> {
  const response = await fetch(GUESTBOOK_API_PATHS.countries, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return [];
  const json = (await response.json()) as { countries: string[] };
  return json.countries ?? [];
}

// ─── Formatting ──────────────────────────────────────────────────────────────

function countryToFlag(code: string | null) {
  if (!code || code.length !== 2) return null;
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...[...upper].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const GuestbookClientService = {
  fetchEntries,
  fetchCountries,
  countryToFlag,
} as const;
