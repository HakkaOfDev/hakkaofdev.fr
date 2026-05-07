import type { ComponentType } from "react";
import { expandAlias, useAliasesStore } from "@/stores/aliases.store";
import type { Pipeline } from "@/types/command";

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
  resume: "cv",
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
  prefix(
    "lang",
    "lang",
    true,
    () => import("@/components/commands/renders/CLang"),
  ),
  prefix(
    "alias",
    "alias",
    true,
    () => import("@/components/commands/renders/CAlias"),
  ),
  exact(
    "history",
    "history",
    () => import("@/components/commands/renders/CHistory"),
  ),
  prefix(
    "man",
    "man",
    true,
    () => import("@/components/commands/renders/CMan"),
  ),
];

export async function resolveTerminalRenderer(input: string) {
  const normalized = normalizeInput(input);
  if (!normalized) return null;

  const { baseInput, pipeline } = splitPipeline(normalized);
  const entry = ENTRIES.find((candidate) => candidate.match(baseInput));
  if (!entry) return null;

  const cachedComponent = rendererCache.get(entry.key);
  if (cachedComponent) {
    return {
      Component: cachedComponent,
      needsInput: entry.needsInput,
      normalizedInput: baseInput,
      pipeline,
    };
  }

  const loadedModule = await entry.load();
  rendererCache.set(entry.key, loadedModule.default);

  return {
    Component: loadedModule.default,
    needsInput: entry.needsInput,
    normalizedInput: baseInput,
    pipeline,
  };
}

/**
 * Normalize the raw input:
 * - lowercase + trim
 * - apply built-in token aliases (`?` → `help`, `cls` → `clear`, …)
 * - expand user-defined aliases via the aliases store
 * Pipeline operators are preserved.
 */
function normalizeInput(raw: string) {
  const normalized = raw.trim().toLowerCase();
  if (!normalized) return "";

  const userAliases = readUserAliases();
  const expanded = expandAlias(normalized, userAliases);

  const token = expanded.split(/\s+/, 1)[0];
  const builtinAlias = TOKEN_ALIASES[token];
  if (!builtinAlias) return expanded;

  const remainder = expanded.slice(token.length);
  return `${builtinAlias}${remainder}`;
}

function readUserAliases() {
  if (typeof window === "undefined") return {};
  try {
    return useAliasesStore.getState().aliases;
  } catch {
    return {};
  }
}

/**
 * Parse `cmd args... | grep pattern` into its base command and pipeline plan.
 * Only the `grep` filter is supported for now.
 */
function splitPipeline(input: string): {
  baseInput: string;
  pipeline?: Pipeline;
} {
  const pipeIndex = input.indexOf("|");
  if (pipeIndex === -1) return { baseInput: input };

  const left = input.slice(0, pipeIndex).trim();
  const right = input.slice(pipeIndex + 1).trim();
  if (!right.startsWith("grep")) {
    return { baseInput: left || input };
  }

  const pattern = right.slice(4).trim();
  if (!pattern) return { baseInput: left || input };

  return { baseInput: left, pipeline: { grep: stripQuotes(pattern) } };
}

function stripQuotes(raw: string) {
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1);
  }
  return raw;
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
