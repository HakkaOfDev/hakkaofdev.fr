import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

function deepMerge(target: Messages, source: Messages): Messages {
  const result: Messages = { ...target };
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];
    if (
      sourceValue !== null &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue as Messages, sourceValue as Messages);
    } else {
      result[key] = sourceValue;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const enMessages = (await import("../messages/en.json")).default as Messages;
  if (locale === routing.defaultLocale) {
    return { locale, messages: enMessages };
  }

  const localeMessages = (await import(`../messages/${locale}.json`))
    .default as Messages;

  return {
    locale,
    messages: deepMerge(enMessages, localeMessages),
  };
});
