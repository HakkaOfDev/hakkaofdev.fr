"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const ALIASES_STORAGE_KEY = "terminal:aliases";

export const RESERVED_ALIAS_NAMES = new Set<string>([
  "alias",
  "history",
  "man",
  "fortune",
  "motd",
  "help",
  "clear",
  "reset",
  "echo",
  "exit",
]);

const ALIAS_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
const MAX_ALIASES = 32;
const MAX_NAME_LENGTH = 32;
const MAX_VALUE_LENGTH = 200;

export type AliasMap = Record<string, string>;

type AliasesStore = {
  aliases: AliasMap;
  setAlias: (
    name: string,
    value: string,
  ) => { ok: true } | { ok: false; reason: AliasError };
  removeAlias: (name: string) => boolean;
  clearAliases: () => void;
};

export type AliasError =
  | "invalid-name"
  | "reserved-name"
  | "empty-value"
  | "value-too-long"
  | "limit-reached"
  | "self-reference";

export function isValidAliasName(name: string): boolean {
  return (
    typeof name === "string" &&
    name.length > 0 &&
    name.length <= MAX_NAME_LENGTH &&
    ALIAS_NAME_PATTERN.test(name)
  );
}

export const useAliasesStore = create<AliasesStore>()(
  persist(
    (set, get) => ({
      aliases: {},
      setAlias: (rawName, rawValue) => {
        const name = rawName.trim().toLowerCase();
        const value = rawValue.trim();

        if (!isValidAliasName(name))
          return { ok: false, reason: "invalid-name" };
        if (RESERVED_ALIAS_NAMES.has(name))
          return { ok: false, reason: "reserved-name" };
        if (!value) return { ok: false, reason: "empty-value" };
        if (value.length > MAX_VALUE_LENGTH)
          return { ok: false, reason: "value-too-long" };

        const firstToken = value.split(/\s+/, 1)[0]?.toLowerCase();
        if (firstToken === name) return { ok: false, reason: "self-reference" };

        const current = get().aliases;
        if (!(name in current) && Object.keys(current).length >= MAX_ALIASES) {
          return { ok: false, reason: "limit-reached" };
        }

        set({ aliases: { ...current, [name]: value } });
        return { ok: true };
      },
      removeAlias: (rawName) => {
        const name = rawName.trim().toLowerCase();
        const current = get().aliases;
        if (!(name in current)) return false;
        const next: AliasMap = {};
        for (const key of Object.keys(current)) {
          if (key !== name) next[key] = current[key];
        }
        set({ aliases: next });
        return true;
      },
      clearAliases: () => set({ aliases: {} }),
    }),
    {
      name: ALIASES_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ aliases: state.aliases }),
    },
  ),
);

/**
 * Resolve an alias chain on the current input.
 * Only the first token is replaced; subsequent tokens are preserved.
 * Returns the original input if no alias matches or a cycle is detected.
 */
export function expandAlias(input: string, aliases: AliasMap): string {
  if (!input) return input;
  const seen = new Set<string>();
  let current = input.trim();

  for (let i = 0; i < 8; i += 1) {
    const [head, ...rest] = current.split(/\s+/);
    if (!head) return current;
    const key = head.toLowerCase();
    if (seen.has(key)) return current;
    const replacement = aliases[key];
    if (!replacement) return current;
    seen.add(key);
    current =
      rest.length > 0 ? `${replacement} ${rest.join(" ")}` : replacement;
  }
  return current;
}
