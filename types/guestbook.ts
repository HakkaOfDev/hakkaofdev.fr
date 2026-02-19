export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  website: string | null;
  country: string | null;
  created_at: string;
};

export type GuestbookCreateInput = {
  name: unknown;
  message: unknown;
  website?: unknown;
  company?: unknown;
};

export type GuestbookCreateResult =
  | { ok: true; status: "published" | "pending_moderation" }
  | { ok: false; error: string; httpStatus: number };

export type GuestbookListResult =
  | { ok: true; entries: GuestbookEntry[] }
  | { ok: false; error: string; httpStatus: number };

export type GuestbookListResponse = {
  entries: GuestbookEntry[];
};

export type GuestbookApiError = {
  error?: string;
};

export type SortOrder = "desc" | "asc";

export type GuestbookFilters = {
  sort: SortOrder;
  country: string | null;
};

export type GuestbookCountriesResult =
  | { ok: true; countries: string[] }
  | { ok: false; error: string; httpStatus: number };

export type GuestbookListOptions = {
  limit?: number;
  sort?: "asc" | "desc";
  country?: string;
};

export type GuestbookCreateMeta = {
  ipHash: string | null;
  userAgent: string | null;
  country: string | null;
};
