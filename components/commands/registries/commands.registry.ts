import type { ComponentType } from "react";

type StaticRenderer = ComponentType<Record<string, never>>;
type InputRenderer = ComponentType<{ input: string }>;
type RendererModule = { default: StaticRenderer | InputRenderer };
type RendererLoader = () => Promise<RendererModule>;
type RendererEntry = {
  key: string;
  needsInput: boolean;
  load: RendererLoader;
  match: (input: string) => boolean;
};

const TOKEN_ALIASES: Record<string, string> = {
  "?": "help",
  cls: "clear",
  dir: "help",
  ls: "help",
};

const rendererCache = new Map<string, StaticRenderer | InputRenderer>();

const ENTRIES: ReadonlyArray<RendererEntry> = [
  exact("help", "help", () => import("@/components/commands/renders/CHelp")),
  exact("clear", "clear", () => import("@/components/commands/renders/CClear")),
  exact(
    "contact",
    "contact",
    () => import("@/components/commands/renders/CContact"),
  ),
  exact("cv", "cv", () => import("@/components/commands/renders/CCv")),
  exact("reset", "reset", () => import("@/components/commands/renders/CReset")),
  exact(
    "projects",
    "projects",
    () => import("@/components/commands/renders/CProjects"),
  ),
  exact("repo", "repo", () => import("@/components/commands/renders/CRepo")),
  exact(
    "skills",
    "skills",
    () => import("@/components/commands/renders/CSkills"),
  ),
  exact("about", "about", () => import("@/components/commands/renders/CAbout")),
  exact(
    "education",
    "education",
    () => import("@/components/commands/renders/CEducation"),
  ),
  exact(
    "experiences",
    "experiences",
    () => import("@/components/commands/renders/CExperiences"),
  ),
  exact("stats", "stats", () => import("@/components/commands/renders/CStats")),
  prefix(
    "echo",
    "echo",
    true,
    () => import("@/components/commands/renders/CEcho"),
  ),
  prefix(
    "guestbook",
    "guestbook",
    true,
    () => import("@/components/commands/renders/guestbook/CGuestbook"),
  ),
  prefix(
    "spotify",
    "spotify",
    true,
    () => import("@/components/commands/renders/spotify/CSpotify"),
  ),
  prefix(
    "theme",
    "theme",
    true,
    () => import("@/components/commands/renders/theme/CTheme"),
  ),
];

export async function resolveTerminalRenderer(input: string) {
  const normalizedInput = normalizeInput(input);
  if (!normalizedInput) return null;

  const entry = ENTRIES.find((candidate) => candidate.match(normalizedInput));
  if (!entry) return null;

  const cachedComponent = rendererCache.get(entry.key);
  if (cachedComponent) {
    return {
      Component: cachedComponent,
      needsInput: entry.needsInput,
      normalizedInput,
    };
  }

  const loadedModule = await entry.load();
  rendererCache.set(entry.key, loadedModule.default);

  return {
    Component: loadedModule.default,
    needsInput: entry.needsInput,
    normalizedInput,
  };
}

function normalizeInput(raw: string) {
  const normalized = raw.trim().toLowerCase();
  if (!normalized) return "";
  const token = normalized.split(/\s+/, 1)[0];
  const alias = TOKEN_ALIASES[token];
  return alias ?? normalized;
}

function exact(
  command: string,
  key: string,
  load: RendererLoader,
): RendererEntry {
  return { key, needsInput: false, load, match: (input) => input === command };
}

function prefix(
  command: string,
  key: string,
  needsInput: boolean,
  load: RendererLoader,
): RendererEntry {
  return {
    key,
    needsInput,
    load,
    match: (input) => input === command || input.startsWith(`${command} `),
  };
}
