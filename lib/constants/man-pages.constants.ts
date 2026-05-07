export type ManPage = {
  /** Command name as typed in the prompt (e.g., "theme set"). */
  name: string;
  /** One-line synopsis displayed under NAME. */
  synopsis: string;
  /** Usage line (e.g., "theme set <name>"). */
  usage: string;
  /** Concrete examples shown under EXAMPLES. */
  examples: string[];
  /** i18n key under `Commands.descriptions.*` for the long description. */
  descriptionSlug: string;
  /** Optional list of related command names shown under SEE ALSO. */
  seeAlso?: string[];
};

/**
 * Detailed reference per command. Used by the `man` command.
 * Synopsis/usage/examples stay in English; description is localized via i18n.
 */
export const MAN_PAGES: Record<string, ManPage> = {
  about: {
    name: "about",
    synopsis: "Personal background, languages and hobbies",
    usage: "about",
    examples: ["about"],
    descriptionSlug: "about",
    seeAlso: ["contact", "cv"],
  },
  alias: {
    name: "alias",
    synopsis: "Define, list and remove command shortcuts",
    usage: "alias [<name>=<command> | remove <name> | clear]",
    examples: [
      "alias",
      "alias hi=about",
      "alias gh='spotify history'",
      "alias remove hi",
      "alias clear",
    ],
    descriptionSlug: "alias",
    seeAlso: ["help"],
  },
  clear: {
    name: "clear",
    synopsis: "Clear the terminal output",
    usage: "clear",
    examples: ["clear"],
    descriptionSlug: "clear",
    seeAlso: ["reset"],
  },
  contact: {
    name: "contact",
    synopsis: "Show email and social profiles",
    usage: "contact",
    examples: ["contact"],
    descriptionSlug: "contact",
    seeAlso: ["about"],
  },
  cv: {
    name: "cv",
    synopsis: "Open the generated PDF resume",
    usage: "cv",
    examples: ["cv"],
    descriptionSlug: "cv",
    seeAlso: ["about", "experiences"],
  },
  echo: {
    name: "echo",
    synopsis: "Print a message to the terminal",
    usage: "echo <message>",
    examples: ["echo hello world", 'echo "hi friend"'],
    descriptionSlug: "echo",
  },
  education: {
    name: "education",
    synopsis: "Education timeline",
    usage: "education",
    examples: ["education"],
    descriptionSlug: "education",
    seeAlso: ["experiences"],
  },
  experiences: {
    name: "experiences",
    synopsis: "Professional experience timeline",
    usage: "experiences",
    examples: ["experiences"],
    descriptionSlug: "experiences",
    seeAlso: ["projects", "skills"],
  },
  guestbook: {
    name: "guestbook",
    synopsis: "Read or sign the guestbook",
    usage: "guestbook [read | sign]",
    examples: ["guestbook", "guestbook read", "guestbook sign"],
    descriptionSlug: "guestbook",
  },
  help: {
    name: "help",
    synopsis: "List all available commands",
    usage: "help",
    examples: ["help", "help | grep spotify"],
    descriptionSlug: "help",
    seeAlso: ["man"],
  },
  history: {
    name: "history",
    synopsis: "Show this session's command history",
    usage: "history",
    examples: ["history", "history | grep theme"],
    descriptionSlug: "history",
  },
  lang: {
    name: "lang",
    synopsis: "Show or switch the active language",
    usage: "lang [set <code> | auto]",
    examples: ["lang", "lang set fr", "lang auto"],
    descriptionSlug: "lang",
  },
  man: {
    name: "man",
    synopsis: "Show the manual page for a command",
    usage: "man <command>",
    examples: ["man theme", "man spotify", "man alias"],
    descriptionSlug: "man",
    seeAlso: ["help"],
  },
  projects: {
    name: "projects",
    synopsis: "Things I've built, shipped, or contributed to",
    usage: "projects",
    examples: ["projects"],
    descriptionSlug: "projects",
    seeAlso: ["repo", "experiences"],
  },
  repo: {
    name: "repo",
    synopsis: "Open the source code of this portfolio",
    usage: "repo",
    examples: ["repo"],
    descriptionSlug: "repo",
  },
  reset: {
    name: "reset",
    synopsis: "Reset the terminal to the welcome screen",
    usage: "reset",
    examples: ["reset"],
    descriptionSlug: "reset",
    seeAlso: ["clear"],
  },
  skills: {
    name: "skills",
    synopsis: "Categorized skills, tools and technologies",
    usage: "skills",
    examples: ["skills"],
    descriptionSlug: "skills",
  },
  spotify: {
    name: "spotify",
    synopsis: "Now playing, top tracks, listening history",
    usage: "spotify [now | top | history]",
    examples: ["spotify now", "spotify top", "spotify history"],
    descriptionSlug: "spotify",
  },
  stats: {
    name: "stats",
    synopsis: "Coding activity, GitHub & visitor stats",
    usage: "stats",
    examples: ["stats"],
    descriptionSlug: "stats",
  },
  theme: {
    name: "theme",
    synopsis: "Show or switch the UI theme",
    usage: "theme [list | set <name> | preview <name> | create | validate]",
    examples: [
      "theme",
      "theme list",
      "theme set dracula",
      "theme preview nord",
      "theme validate",
    ],
    descriptionSlug: "theme",
  },
};

export const MAN_PAGE_NAMES = Object.keys(MAN_PAGES).sort();
