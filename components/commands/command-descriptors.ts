import type { ShortcutProps } from "@/components/ui/Shortcut";
import type { TagProps } from "@/components/ui/Tag";

// ─── Group types ────────────────────────────────────────────────────────

export type CommandGroup =
  | "Work"
  | "Profile"
  | "Spotify"
  | "Theme"
  | "Terminal";

export type CommandGroupMeta = {
  group: CommandGroup;
  shortcutVariant: ShortcutProps["variant"];
  tagVariant: TagProps["variant"];
};

/** Ordered list of command groups (rendering order for help, etc.). */
export const COMMAND_GROUPS: CommandGroupMeta[] = [
  { group: "Work", shortcutVariant: "primary", tagVariant: "teal" },
  { group: "Profile", shortcutVariant: "secondary", tagVariant: "gold" },
  { group: "Spotify", shortcutVariant: "purple", tagVariant: "purple" },
  { group: "Theme", shortcutVariant: "orange", tagVariant: "orange" },
  { group: "Terminal", shortcutVariant: "default", tagVariant: "default" },
];

/** Fast lookup: group name → metadata. */
export const GROUP_META = Object.fromEntries(
  COMMAND_GROUPS.map((g) => [g.group, g]),
) as Record<CommandGroup, CommandGroupMeta>;

// ─── Command types ──────────────────────────────────────────────────────

export type CommandDescriptor = {
  command: string;
  description: string;
  group: CommandGroup;
};

// ─── Base commands ──────────────────────────────────────────────────────

export const COMMANDS: CommandDescriptor[] = [
  {
    command: "projects",
    description: "Things I've built, shipped, or contributed to",
    group: "Work",
  },
  {
    command: "experiences",
    description: "Explore my professional work history and accomplishments",
    group: "Work",
  },
  {
    command: "about",
    description: "Learn more about my background, interests and career goals",
    group: "Profile",
  },
  {
    command: "skills",
    description: "View my technical skills, tools and technologies I work with",
    group: "Profile",
  },
  {
    command: "education",
    description: "See my academic background and qualifications",
    group: "Profile",
  },
  {
    command: "contact",
    description:
      "Get my email address, social links and preferred contact paths",
    group: "Terminal",
  },
  {
    command: "cv",
    description: "Preview and download my generated PDF resume",
    group: "Profile",
  },
  {
    command: "spotify",
    description: "Display the help for the spotify sub-commands",
    group: "Spotify",
  },
  {
    command: "theme",
    description: "Show or switch the UI theme",
    group: "Theme",
  },
  {
    command: "help",
    description: "Display all available commands and their descriptions",
    group: "Terminal",
  },
  {
    command: "clear",
    description: "Clear all previous commands and output from the terminal",
    group: "Terminal",
  },
  {
    command: "reset",
    description: "Reset the terminal to the welcome screen and clear history",
    group: "Terminal",
  },
  {
    command: "stats",
    description:
      "Display coding activity, GitHub metrics & unique visitor count",
    group: "Profile",
  },
  {
    command: "repo",
    description: "Open the source code of this portfolio repository",
    group: "Terminal",
  },
  {
    command: "echo",
    description: "Print a message to the terminal",
    group: "Terminal",
  },
];

// ─── Sub-commands ───────────────────────────────────────────────────────

export type SpotifyCommandDescriptor = {
  command: "now" | "top" | "history";
  description: string;
};

export const SPOTIFY_COMMANDS: SpotifyCommandDescriptor[] = [
  { command: "now", description: "Display the currently playing song" },
  { command: "top", description: "Display my top tracks" },
  { command: "history", description: "Display my listening history" },
];

export type ThemeCommandDescriptor = {
  command: "dark" | "light" | "system";
  description: string;
};

export const THEME_COMMANDS: ThemeCommandDescriptor[] = [
  { command: "dark", description: "Switch to dark mode" },
  { command: "light", description: "Switch to light mode" },
  { command: "system", description: "Follow the operating system preference" },
];

// ─── Derived: every command including expanded sub-commands ─────────────

export const ALL_COMMANDS: CommandDescriptor[] = [
  ...COMMANDS,
  ...SPOTIFY_COMMANDS.map((c) => ({
    command: `spotify ${c.command}`,
    description: c.description,
    group: "Spotify" as const,
  })),
  ...THEME_COMMANDS.map((c) => ({
    command: `theme ${c.command}`,
    description: c.description,
    group: "Theme" as const,
  })),
];

// ─── Helpers ────────────────────────────────────────────────────────────

/** Commands grouped by their group, in COMMAND_GROUPS order, sorted alphabetically within each group. */
export function getCommandsByGroup() {
  return COMMAND_GROUPS.map((meta) => ({
    meta,
    commands: ALL_COMMANDS.filter((c) => c.group === meta.group).sort((a, b) =>
      a.command.localeCompare(b.command),
    ),
  }));
}
