import type {
  AliasCommandDescriptor,
  CommandDescriptor,
  CommandGroup,
  CommandGroupMeta,
  GuestbookCommandDescriptor,
  LangCommandDescriptor,
  SpotifyCommandDescriptor,
  StatsCommandDescriptor,
  ThemeCommandDescriptor,
} from "@/types/command";

export type {
  AliasCommandDescriptor,
  CommandDescriptor,
  CommandGroup,
  CommandGroupMeta,
  GuestbookCommandDescriptor,
  LangCommandDescriptor,
  SpotifyCommandDescriptor,
  StatsCommandDescriptor,
  ThemeCommandDescriptor,
} from "@/types/command";

/** Ordered list of command groups (rendering order for help, etc.). */
export const COMMAND_GROUPS: CommandGroupMeta[] = [
  { group: "Work", shortcutVariant: "primary", tagVariant: "teal" },
  { group: "Profile", shortcutVariant: "secondary", tagVariant: "gold" },
  { group: "Guestbook", shortcutVariant: "pink", tagVariant: "pink" },
  { group: "Spotify", shortcutVariant: "purple", tagVariant: "purple" },
  { group: "Theme", shortcutVariant: "orange", tagVariant: "orange" },
  { group: "Terminal", shortcutVariant: "default", tagVariant: "default" },
];

/** Fast lookup: group name → metadata. */
export const GROUP_META = Object.fromEntries(
  COMMAND_GROUPS.map((g) => [g.group, g]),
) as Record<CommandGroup, CommandGroupMeta>;

// ─── Base commands ──────────────────────────────────────────────────────

export const COMMANDS: CommandDescriptor[] = [
  { command: "projects", slug: "projects", group: "Work" },
  { command: "experiences", slug: "experiences", group: "Work" },
  { command: "recommendations", slug: "recommendations", group: "Work" },
  { command: "about", slug: "about", group: "Profile" },
  { command: "skills", slug: "skills", group: "Profile" },
  { command: "education", slug: "education", group: "Profile" },
  { command: "contact", slug: "contact", group: "Terminal" },
  { command: "guestbook", slug: "guestbook", group: "Guestbook" },
  { command: "cv", slug: "cv", group: "Profile" },
  { command: "spotify", slug: "spotify", group: "Spotify" },
  { command: "theme", slug: "theme", group: "Theme" },
  { command: "help", slug: "help", group: "Terminal" },
  { command: "clear", slug: "clear", group: "Terminal" },
  { command: "reset", slug: "reset", group: "Terminal" },
  { command: "stats", slug: "stats", group: "Profile" },
  { command: "repo", slug: "repo", group: "Terminal" },
  { command: "echo", slug: "echo", group: "Terminal" },
  { command: "lang", slug: "lang", group: "Terminal" },
  { command: "alias", slug: "alias", group: "Terminal" },
  { command: "history", slug: "history", group: "Terminal" },
  { command: "man", slug: "man", group: "Terminal" },
];

// ─── Sub-commands ───────────────────────────────────────────────────────

export const SPOTIFY_COMMANDS: SpotifyCommandDescriptor[] = [
  { command: "now", slug: "spotifyNow" },
  { command: "top", slug: "spotifyTop" },
  { command: "history", slug: "spotifyHistory" },
];
export const GUESTBOOK_COMMANDS: GuestbookCommandDescriptor[] = [
  { command: "read", slug: "guestbookRead" },
  { command: "sign", slug: "guestbookSign" },
];
export const THEME_COMMANDS: ThemeCommandDescriptor[] = [
  { command: "list", slug: "themeList" },
  { command: "set", slug: "themeSet" },
  { command: "preview", slug: "themePreview" },
  { command: "create", slug: "themeCreate" },
  { command: "validate", slug: "themeValidate" },
];

export const LANG_COMMANDS: LangCommandDescriptor[] = [
  { command: "set", slug: "langSet" },
  { command: "auto", slug: "langAuto" },
];

export const ALIAS_COMMANDS: AliasCommandDescriptor[] = [
  { command: "remove", slug: "aliasRemove" },
  { command: "clear", slug: "aliasClear" },
];

export const STATS_COMMANDS: StatsCommandDescriptor[] = [
  { command: "countries", slug: "statsCountries" },
  { command: "browsers", slug: "statsBrowsers" },
  { command: "referrers", slug: "statsReferrers" },
  { command: "trend", slug: "statsTrend" },
];

/** Command names that act as namespaces for sub-commands. */
export const SUBCOMMAND_PREFIXES = [
  "guestbook",
  "spotify",
  "theme",
  "lang",
  "alias",
  "stats",
] as const;

// ─── Derived: every command including expanded sub-commands ─────────────

export const ALL_COMMANDS: CommandDescriptor[] = [
  ...COMMANDS,
  ...GUESTBOOK_COMMANDS.map((c) => ({
    command: `guestbook ${c.command}`,
    slug: c.slug,
    group: "Guestbook" as const,
  })),
  ...SPOTIFY_COMMANDS.map((c) => ({
    command: `spotify ${c.command}`,
    slug: c.slug,
    group: "Spotify" as const,
  })),
  ...THEME_COMMANDS.map((c) => ({
    command: `theme ${c.command}`,
    slug: c.slug,
    group: "Theme" as const,
  })),
  ...LANG_COMMANDS.map((c) => ({
    command: `lang ${c.command}`,
    slug: c.slug,
    group: "Terminal" as const,
  })),
  ...ALIAS_COMMANDS.map((c) => ({
    command: `alias ${c.command}`,
    slug: c.slug,
    group: "Terminal" as const,
  })),
  ...STATS_COMMANDS.map((c) => ({
    command: `stats ${c.command}`,
    slug: c.slug,
    group: "Profile" as const,
  })),
];

// ─── Helpers ────────────────────────────────────────────────────────────

/**
 * Base commands grouped by their group, in COMMAND_GROUPS order and sorted
 * alphabetically within each group. Excludes expanded sub-commands
 * (e.g. `lang set`, `alias remove`) — `help` only lists the entry points.
 */
export function getCommandsByGroup() {
  return COMMAND_GROUPS.map((meta) => ({
    meta,
    commands: COMMANDS.filter((c) => c.group === meta.group).sort((a, b) =>
      a.command.localeCompare(b.command),
    ),
  }));
}
