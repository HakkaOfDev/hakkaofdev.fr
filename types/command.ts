import type { ShortcutProps } from "@/components/ui/Shortcut";
import type { TagProps } from "@/components/ui/Tag";

export type Command = {
  id: string;
  input: string;
  timestamp: Date;
};

export type CommandGroup =
  | "Work"
  | "Profile"
  | "Guestbook"
  | "Spotify"
  | "Theme"
  | "Terminal";

export type CommandGroupMeta = {
  group: CommandGroup;
  shortcutVariant: ShortcutProps["variant"];
  tagVariant: TagProps["variant"];
};

export type CommandDescriptor = {
  command: string;
  /** Key under `Commands.descriptions.*` for the localized description. */
  slug: string;
  group: CommandGroup;
};

// ─── Sub-commands ───────────────────────────────────────────────────────

export type SpotifyCommandDescriptor = {
  command: "now" | "top" | "history";
  slug: string;
};

export type GuestbookCommandDescriptor = {
  command: "read" | "sign";
  slug: string;
};

export type ThemeCommandDescriptor = {
  command: "list" | "set" | "preview" | "create" | "validate";
  slug: string;
};

export type LangCommandDescriptor = {
  command: "set" | "auto";
  slug: string;
};

export type AliasCommandDescriptor = {
  command: "remove" | "clear";
  slug: string;
};

// ─── Pipelines ──────────────────────────────────────────────────────────

/**
 * Plan describing pipeline operators applied after the base command.
 * Currently only the `grep` text filter is supported.
 */
export type Pipeline = {
  grep?: string;
};

// ─── Dynamic commands ───────────────────────────────────────────────────

/**
 * Configuration for commands that accept dynamic parameters.
 * The paramProvider function returns an array of parameter values
 * that can be used for autocomplete.
 */
export type DynamicParamConfig = {
  /** The command pattern to match (e.g., "theme set", "theme preview") */
  pattern: string;
  /** Function that returns available parameter values */
  paramProvider: () => string[];
  /** Group this command belongs to */
  group: CommandGroup;
};
