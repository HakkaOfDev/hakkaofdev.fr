export const GUESTBOOK_CONFIG = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
  DEFAULT_RATE_LIMIT_MAX_PER_HOUR: 3,
  MAX_NAME_LENGTH: 60,
  MIN_NAME_LENGTH: 2,
  MAX_MESSAGE_LENGTH: 300,
  MIN_MESSAGE_LENGTH: 2,
  MAX_WEBSITE_LENGTH: 240,
  MAX_USER_AGENT_LENGTH: 255,
} as const;

export const HONEYPOT_MAX_LENGTH = 100;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export const GUESTBOOK_ERRORS = {
  SCHEMA_MISSING:
    "Guestbook is not initialized. Run supabase/schema/guestbook.sql.",
  UNAVAILABLE: "Guestbook service is unavailable.",
  FETCH_ENTRIES_FAILED: "Failed to fetch guestbook entries.",
  FETCH_COUNTRIES_FAILED: "Failed to fetch countries.",
  SAVE_FAILED: "Failed to save guestbook entry.",
  RATE_LIMIT_CHECK_FAILED: "Rate limit check failed.",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded. Please try again later.",
  NAME_TOO_SHORT: "Name must be at least 2 characters.",
  MESSAGE_TOO_SHORT: "Message must be at least 2 characters.",
  WEBSITE_INVALID: "Website URL is invalid.",
} as const;
