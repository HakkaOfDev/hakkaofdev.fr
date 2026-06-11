"use client";

import { Info, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { AnimatedSpan, RevealGroup } from "@/components/AnimatedComponents";
import { ALIAS_COMMANDS } from "@/components/commands/registries/alias.registry";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { Shortcut } from "@/components/ui/Shortcut";
import {
  type AliasError,
  isValidAliasName,
  RESERVED_ALIAS_NAMES,
  useAliasesStore,
} from "@/stores/aliases.store";
import SubCommandHelp from "./SubCommandHelp";

type ParsedAlias =
  | { kind: "list" }
  | { kind: "remove"; name?: string }
  | { kind: "clear" }
  | { kind: "set"; name: string; value: string }
  | { kind: "invalid"; error: AliasError | "missing-equals" };

function parseInput(input: string): ParsedAlias {
  const rest = input.trim().slice(5).trim();
  if (!rest) return { kind: "list" };

  const [head, ...tail] = rest.split(/\s+/);
  if (head === "remove") {
    return { kind: "remove", name: tail[0]?.toLowerCase() };
  }
  if (head === "clear") return { kind: "clear" };

  const equalsIdx = rest.indexOf("=");
  if (equalsIdx === -1) return { kind: "invalid", error: "missing-equals" };

  const name = rest.slice(0, equalsIdx).trim().toLowerCase();
  const value = rest.slice(equalsIdx + 1).trim();

  if (!isValidAliasName(name))
    return { kind: "invalid", error: "invalid-name" };
  if (RESERVED_ALIAS_NAMES.has(name))
    return { kind: "invalid", error: "reserved-name" };
  if (!value) return { kind: "invalid", error: "empty-value" };

  return { kind: "set", name, value };
}

function CAlias({ input }: { input: string }) {
  const t = useTranslations("Alias");
  const grep = useGrep();
  const grepRaw = useGrepRaw();
  const aliases = useAliasesStore((state) => state.aliases);
  const setAlias = useAliasesStore((state) => state.setAlias);
  const removeAlias = useAliasesStore((state) => state.removeAlias);
  const clearAliases = useAliasesStore((state) => state.clearAliases);

  const parsed = useMemo(() => parseInput(input), [input]);
  const [setStatus, setSetStatus] = useState<
    { ok: true } | { ok: false; reason: AliasError } | null
  >(null);
  const [removeOutcome, setRemoveOutcome] = useState<boolean | null>(null);
  const [clearOutcome, setClearOutcome] = useState<boolean | null>(null);

  useEffect(() => {
    if (parsed.kind !== "set") return;
    setSetStatus(setAlias(parsed.name, parsed.value));
  }, [parsed, setAlias]);

  useEffect(() => {
    if (parsed.kind !== "remove" || !parsed.name) return;
    setRemoveOutcome(removeAlias(parsed.name));
  }, [parsed, removeAlias]);

  useEffect(() => {
    if (parsed.kind !== "clear") return;
    const had = Object.keys(useAliasesStore.getState().aliases).length > 0;
    if (had) clearAliases();
    setClearOutcome(had);
  }, [parsed, clearAliases]);

  if (parsed.kind === "set") {
    if (!setStatus) return null;
    if (setStatus.ok) {
      return (
        <AnimatedSpan>
          <p className="text-muted-foreground">
            {t("created", { name: parsed.name, value: parsed.value })}
          </p>
        </AnimatedSpan>
      );
    }
    return (
      <AnimatedSpan>
        <p className="text-destructive">{t(`errors.${setStatus.reason}`)}</p>
      </AnimatedSpan>
    );
  }

  if (parsed.kind === "invalid") {
    return (
      <AnimatedSpan className="gap-1">
        <p className="text-destructive">{t(`errors.${parsed.error}`)}</p>
        <p className="text-muted-foreground">
          {t("usagePrefix")}{" "}
          <span className="font-semibold text-foreground">
            alias &lt;name&gt;=&lt;command&gt;
          </span>
        </p>
      </AnimatedSpan>
    );
  }

  if (parsed.kind === "clear") {
    if (clearOutcome === null) return null;
    return (
      <AnimatedSpan>
        <p className="text-muted-foreground">
          {clearOutcome ? t("cleared") : t("noneToClear")}
        </p>
      </AnimatedSpan>
    );
  }

  if (parsed.kind === "remove") {
    if (!parsed.name) {
      return (
        <AnimatedSpan>
          <p className="text-destructive">{t("errors.invalid-name")}</p>
        </AnimatedSpan>
      );
    }
    if (removeOutcome === null) return null;
    return (
      <AnimatedSpan>
        <p
          className={
            removeOutcome ? "text-muted-foreground" : "text-destructive"
          }
        >
          {removeOutcome
            ? t("removed", { name: parsed.name })
            : t("notFound", { name: parsed.name })}
        </p>
      </AnimatedSpan>
    );
  }

  // ── list ───────────────────────────────────────────────────────────────
  const entries = Object.entries(aliases)
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([name, value]) =>
      grep
        ? name.toLowerCase().includes(grep) ||
          value.toLowerCase().includes(grep)
        : true,
    );

  return (
    <AnimatedSpan className="gap-3">
      <div className="flex items-center gap-2">
        <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="font-semibold text-primary">{t("title")}</p>
      </div>

      {entries.length === 0 ? (
        <p className="text-muted-foreground text-xs">
          {grep ? t("noMatches", { pattern: grepRaw }) : t("empty")}
        </p>
      ) : (
        <RevealGroup className="gap-1.5">
          {entries.map(([name, value]) => (
            <div
              key={name}
              className="grid grid-cols-[140px_1fr_auto] items-center gap-3"
            >
              <Shortcut label={name} command={name} />
              <span className="min-w-0 truncate font-mono text-muted-foreground text-xs">
                = {value}
              </span>
              <button
                type="button"
                onClick={() => removeAlias(name)}
                className="text-muted-foreground/50 transition-colors hover:text-destructive"
                aria-label={t("removeAria", { name })}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </RevealGroup>
      )}

      <p className="text-muted-foreground/60 text-xs italic">
        {t.rich("tip", {
          example: () => (
            <span className="font-mono text-foreground">alias hi=about</span>
          ),
        })}
      </p>

      <SubCommandHelp
        title={t("subCommandsTitle")}
        items={ALIAS_COMMANDS}
        prefix="alias "
        variant="default"
      />
    </AnimatedSpan>
  );
}

export default CAlias;
