"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useGrep } from "@/components/providers/PipelineProvider";
import { Shortcut } from "@/components/ui/Shortcut";
import { MAN_PAGE_NAMES, MAN_PAGES, type ManPage } from "@/lib/constants";

function lookup(name: string): ManPage | null {
  if (!name) return null;
  // Allow "man theme set" → "theme set"; falls back to "theme" if nothing matches.
  if (MAN_PAGES[name]) return MAN_PAGES[name];
  const head = name.split(/\s+/, 1)[0];
  return MAN_PAGES[head] ?? null;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <p className="font-semibold text-[10px] text-muted-foreground/80 uppercase tracking-widest">
        {title}
      </p>
      <div className="text-xs leading-relaxed">{children}</div>
    </div>
  );
}

function CMan({ input }: { input: string }) {
  const t = useTranslations("Man");
  const tCommands = useTranslations("Commands");
  const grep = useGrep();

  const queryRaw = input.trim().slice(3).trim();
  const query = queryRaw.toLowerCase();
  const page = useMemo(() => lookup(query), [query]);

  if (!queryRaw) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">{t("missingArg")}</p>
        <p className="text-muted-foreground">
          {t("usagePrefix")}{" "}
          <span className="font-semibold text-foreground">
            man &lt;command&gt;
          </span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MAN_PAGE_NAMES.map((name) => (
            <Shortcut
              key={name}
              label={name}
              command={`man ${name}`}
              className="px-1.5 py-0 text-xs"
            />
          ))}
        </div>
      </AnimatedSpan>
    );
  }

  if (!page) {
    return (
      <AnimatedSpan className="gap-2">
        <p className="text-destructive">{t("notFound", { name: queryRaw })}</p>
        <p className="text-muted-foreground">
          {t("usagePrefix")}{" "}
          <span className="font-semibold text-foreground">
            man &lt;command&gt;
          </span>
        </p>
      </AnimatedSpan>
    );
  }

  const examples = grep
    ? page.examples.filter((ex) => ex.toLowerCase().includes(grep))
    : page.examples;

  const description = (() => {
    try {
      return tCommands(`descriptions.${page.descriptionSlug}` as never);
    } catch {
      return page.synopsis;
    }
  })();

  return (
    <AnimatedSpan className="gap-3">
      <p className="font-semibold text-primary">
        {t("title", { name: page.name.toUpperCase() })}
      </p>

      <Section title={t("sections.name")}>
        <span className="font-mono text-foreground">{page.name}</span>
        <span className="text-muted-foreground"> — {page.synopsis}</span>
      </Section>

      <Section title={t("sections.synopsis")}>
        <span className="font-mono text-foreground">{page.usage}</span>
      </Section>

      <Section title={t("sections.description")}>
        <span className="text-muted-foreground">{description}</span>
      </Section>

      {examples.length > 0 && (
        <Section title={t("sections.examples")}>
          <div className="grid gap-1">
            {examples.map((ex) => (
              <Shortcut
                key={ex}
                label={ex}
                command={ex}
                className="justify-self-start font-mono"
              />
            ))}
          </div>
        </Section>
      )}

      {page.seeAlso && page.seeAlso.length > 0 && (
        <Section title={t("sections.seeAlso")}>
          <div className="flex flex-wrap gap-1.5">
            {page.seeAlso.map((ref) => (
              <Shortcut
                key={ref}
                label={ref}
                command={`man ${ref}`}
                className="px-1.5 py-0 text-xs"
              />
            ))}
          </div>
        </Section>
      )}
    </AnimatedSpan>
  );
}

export default CMan;
