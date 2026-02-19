import { Code2, Dumbbell, GitFork } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  const { name, jobTitle, employer } = SITE;
  const { name: employerName, url: employerUrl } = employer;
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ").slice(1).join(" ");

  return (
    <div className={cn("grid gap-4 font-normal tracking-tight", className)}>
      {/* ── Profile ── */}
      <div className="flex flex-col items-start gap-4 sm:grid sm:grid-cols-[64px_1fr]">
        <Image
          src="/avatar.jpg"
          alt="Alexandre Gossard"
          className="aspect-square shrink-0 rounded-lg object-cover object-top shadow-sm ring-1 ring-border/60 dark:ring-overlay-medium"
          quality={75}
          width={64}
          height={64}
          fetchPriority="high"
          sizes="64px"
          priority
        />
        <div className="grid gap-1.5">
          <p className="font-mono text-[11px] text-muted-foreground/80">
            ~ Welcome{" "}
            <span className="inline-block origin-[70%_70%] animate-wave">
              👋
            </span>
          </p>
          <h1 className="font-bold text-xl leading-none tracking-wider md:text-2xl">
            {firstName}{" "}
            <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
              {lastName.toUpperCase()}
            </span>
          </h1>
          <p className="text-muted-foreground text-xs leading-relaxed">
            <span className="font-semibold text-primary underline decoration-primary/50 underline-offset-4">
              Digital Nomad
            </span>{" "}
            · <span className="font-semibold text-secondary">{jobTitle}</span>{" "}
            at{" "}
            <Link
              href={employerUrl}
              className="font-semibold text-secondary transition-colors duration-200 hover:text-secondary/80"
              target="_blank"
            >
              {employerName}
            </Link>
          </p>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Tag
              icon={<GitFork className="h-3 w-3" />}
              label="Open-source advocate"
              variant="purple"
            />
            <Tag
              icon={<Dumbbell className="h-3 w-3" />}
              label="Calisthenics devotee"
              variant="orange"
            />
            <Tag
              icon={<Code2 className="h-3 w-3" />}
              label="React · Next.js"
              variant="teal"
            />
          </div>
        </div>
      </div>

      {/* ── Start Here ── */}
      <ShortcutSection title="Start">
        <ShortcutRow label="Work">
          <Shortcut
            label="projects"
            command="projects"
            variant="primary"
            disabled={isPreview}
          />
          <Shortcut
            label="experiences"
            command="experiences"
            variant="primary"
            disabled={isPreview}
          />
        </ShortcutRow>

        <ShortcutRow label="Profile">
          <Shortcut
            label="skills"
            command="skills"
            variant="secondary"
            disabled={isPreview}
          />
          <Shortcut
            label="about"
            command="about"
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
            label="stats"
            command="stats"
            variant="secondary"
            disabled={isPreview}
          />
          <Shortcut
            label="cv"
            command="cv"
            variant="secondary"
            disabled={isPreview}
          />
        </ShortcutRow>

        <ShortcutRow label="Extras">
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
          <Shortcut
            label="guestbook"
            command="guestbook"
            variant="pink"
            disabled={isPreview}
          />
        </ShortcutRow>

        <ShortcutRow label="Utils">
          <Shortcut label="contact" command="contact" disabled={isPreview} />
          <Shortcut label="help" command="help" disabled={isPreview} />
          <Shortcut label="repo" command="repo" disabled={isPreview} />
        </ShortcutRow>
      </ShortcutSection>
    </div>
  );
}

export default WelcomeHero;
