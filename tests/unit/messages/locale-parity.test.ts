import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createTranslator, IntlErrorCode } from "next-intl";
import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import enMessages from "@/messages/en.json";

type Messages = { [key: string]: string | string[] | Messages };

const MESSAGES_DIR = join(process.cwd(), "messages");

function flatten(messages: Messages, prefix = ""): Map<string, string[]> {
  const entries = new Map<string, string[]>();
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") entries.set(path, [value]);
    else if (Array.isArray(value)) entries.set(path, value);
    else for (const entry of flatten(value, path)) entries.set(...entry);
  }
  return entries;
}

const english = flatten(enMessages as Messages);
describe.each(routing.locales)("messages/%s.json", (locale) => {
  const messages = flatten(
    JSON.parse(readFileSync(join(MESSAGES_DIR, `${locale}.json`), "utf8")),
  );

  it("has exactly the English keys", () => {
    expect([...messages.keys()].sort()).toEqual([...english.keys()].sort());
  });

  it("keeps list messages the same length as English", () => {
    for (const [key, values] of english) {
      expect(messages.get(key)?.length, key).toBe(values.length);
    }
  });

  it("only contains valid ICU messages", () => {
    const invalid: string[] = [];
    for (const [key, values] of messages) {
      for (const value of values) {
        const t = createTranslator({
          locale,
          messages: { message: value },
          onError: (error) => {
            if (error.code === IntlErrorCode.INVALID_MESSAGE) invalid.push(key);
          },
        });
        t("message");
      }
    }
    expect(invalid).toEqual([]);
  });
});
