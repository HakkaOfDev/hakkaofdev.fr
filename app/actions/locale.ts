"use server";

import { cookies } from "next/headers";

const NEXT_LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Removes the explicit locale cookie so the next request falls back to
 * `Accept-Language` detection (handled by next-intl's middleware). Used by
 * the `lang auto` terminal command.
 */
export async function clearLocaleCookieAction() {
  (await cookies()).delete(NEXT_LOCALE_COOKIE);
}
