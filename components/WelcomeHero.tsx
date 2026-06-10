"use client";

import { Code2, Dumbbell, GitFork } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShortcutRow, ShortcutSection } from "@/components/ShortcutSection";
import { Shortcut } from "@/components/ui/Shortcut";
import { Tag } from "@/components/ui/Tag";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

function WelcomeHero({
  className,
  isPreview,
}: {
  className?: string;
  isPreview?: boolean;
}) {
  const t = useTranslations("Welcome");
  const { name } = SITE;
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ").slice(1).join(" ");

  return (
    <div className={cn("grid gap-4 font-normal tracking-tight", className)}>
      {/* ── Profile ── */}
      <div className="flex flex-col items-start gap-4 sm:grid sm:grid-cols-[88px_1fr]">
        <Image
          src="/avatar.jpg"
          alt="Alexandre Gossard"
          className="aspect-square shrink-0 rounded-lg object-cover object-top shadow-sm ring-1 ring-border/60 dark:ring-overlay-medium"
          quality={75}
          width={88}
          height={88}
          fetchPriority="high"
          sizes="88px"
          priority
        />
        <div className="grid gap-1.5">
          <p className="font-mono text-muted-foreground/80 text-xs">
            {t.rich("greeting", {
              wave: (chunks) => (
                <span className="inline-block origin-[70%_70%] animate-wave">
                  {chunks}
                </span>
              ),
            })}
          </p>
          <h1 className="font-bold text-xl leading-none tracking-wider md:text-2xl">
            {firstName}{" "}
            <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
              {lastName.toUpperCase()}
            </span>
          </h1>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {t.rich("intro", {
              tagline: (chunks) => (
                <span className="font-semibold text-primary underline decoration-primary/50 underline-offset-4">
                  {chunks}
                </span>
              ),
              job: (chunks) => (
                <span className="font-semibold text-secondary">{chunks}</span>
              ),
              freelance: (chunks) => (
                <span className="font-semibold text-tertiary">{chunks}</span>
              ),
            })}
          </p>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Tag
              icon={<GitFork className="h-3 w-3" />}
              label={t("tags.openSource")}
              variant="purple"
            />
            <Tag
              icon={<Dumbbell className="h-3 w-3" />}
              label={t("tags.calisthenics")}
              variant="orange"
            />
            <Tag
              icon={<Code2 className="h-3 w-3" />}
              label={t("tags.stack")}
              variant="teal"
            />
          </div>
        </div>
      </div>

      {/* ── Start Here ── */}
      <ShortcutSection title={t("sections.start")}>
        <ShortcutRow label={t("sections.work")}>
          <Shortcut
            label="experiences"
            command="experiences"
            variant="primary"
            disabled={isPreview}
          />
          <Shortcut
            label="projects"
            command="projects"
            variant="primary"
            disabled={isPreview}
          />
          <Shortcut
            label="recommendations"
            command="recommendations"
            variant="primary"
            disabled={isPreview}
          />
        </ShortcutRow>

        <ShortcutRow label={t("sections.profile")}>
          <Shortcut
            label="about"
            command="about"
            variant="secondary"
            disabled={isPreview}
          />
          <Shortcut
            label="cv"
            command="cv"
            variant="secondary"
            disabled={isPreview}
          />
          <Shortcut
            label="education"
            command="education"
            variant="secondary"
            disabled={isPreview}
          />
          <Shortcut
            label="skills"
            command="skills"
            variant="secondary"
            disabled={isPreview}
          />
          <Shortcut
            label="stats"
            command="stats"
            variant="secondary"
            disabled={isPreview}
          />
        </ShortcutRow>

        <ShortcutRow label={t("sections.extras")}>
          <Shortcut
            label="guestbook"
            command="guestbook"
            variant="pink"
            disabled={isPreview}
          />
          <Shortcut
            label="spotify"
            command="spotify"
            variant="purple"
            disabled={isPreview}
          />
          <Shortcut
            label="theme"
            command="theme"
            variant="orange"
            disabled={isPreview}
          />
        </ShortcutRow>

        <ShortcutRow label={t("sections.utils")}>
          <Shortcut label="contact" command="contact" disabled={isPreview} />
          <Shortcut label="help" command="help" disabled={isPreview} />
          <Shortcut label="lang" command="lang" disabled={isPreview} />
          <Shortcut label="repo" command="repo" disabled={isPreview} />
        </ShortcutRow>
      </ShortcutSection>
    </div>
  );
}

export default WelcomeHero;
