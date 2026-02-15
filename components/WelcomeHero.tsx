import { Shortcut } from "@/components/ui/Shortcut";
import { ShortcutRow, ShortcutSection } from "@/components/ShortcutSection";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import { Code2, Dumbbell, GitFork } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function WelcomeHero({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-3 font-normal tracking-tight", className)}>
      {/* ── Profile ── */}
      <div className="flex flex-col sm:grid sm:grid-cols-[64px_1fr] items-start gap-4">
        <Image
          src="/avatar.jpeg"
          alt="Alexandre Gossard"
          className="aspect-square shrink-0 rounded-sm object-cover object-top ring-1 ring-border"
          quality={75}
          width={64}
          height={64}
          fetchPriority="high"
          sizes="64px"
          priority
        />
        <div className="grid gap-1">
          <p className="text-xs text-muted-foreground">Welcome 👋</p>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none">
            I&apos;m Alexandre <span className="text-chart-1">GOSSARD</span>
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-chart-1 underline underline-offset-4">
              Digital Nomad
            </span>{" "}
            ·{" "}
            <span className="font-semibold text-chart-2">
              Lead Frontend Developer
            </span>{" "}
            at{" "}
            <Link
              href="https://kabila.app"
              className="font-semibold text-chart-2 hover:text-chart-2/80 transition-colors duration-200"
              target="_blank"
            >
              kabila.app
            </Link>
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2">
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
          <Shortcut label="projects" command="projects" variant="primary" />
          <Shortcut
            label="experiences"
            command="experiences"
            variant="primary"
          />
        </ShortcutRow>

        <ShortcutRow label="Profile">
          <Shortcut label="skills" command="skills" variant="secondary" />
          <Shortcut label="about" command="about" variant="secondary" />
          <Shortcut label="education" command="education" variant="secondary" />
        </ShortcutRow>

        <ShortcutRow label="Extras">
          <Shortcut label="spotify" command="spotify" />
          <Shortcut label="help" command="help" />
        </ShortcutRow>
      </ShortcutSection>
    </div>
  );
}

export default WelcomeHero;
