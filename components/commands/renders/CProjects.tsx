"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AnimatedSpan, RevealGroup } from "@/components/AnimatedComponents";
import {
  DetailBullets,
  DetailDialog,
  DetailSection,
} from "@/components/commands/renders/DetailDialog";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { Tag } from "@/components/ui/Tag";
import { PROJECTS } from "@/lib/constants";
import type { ProjectEntry } from "@/lib/constants/projects.constants";
import { cn } from "@/lib/utils";
import { matchesGrep } from "@/lib/utils/grep.utils";

function ProjectImage({
  project,
  name,
  sizes,
  className,
}: {
  project: ProjectEntry;
  name: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-video overflow-hidden", className)}>
      <Image
        src={project.imageUrl}
        alt={name}
        className={cn(
          "object-cover transition-transform duration-300 group-hover:scale-105",
          project.imagePosition,
        )}
        sizes={sizes}
        fill
      />
    </div>
  );
}

function ProjectDialog({
  project,
  open,
  onClose,
}: {
  project: ProjectEntry | null;
  open: boolean;
  onClose: () => void;
}) {
  const tProjects = useTranslations("CV.projects");
  const tCommands = useTranslations("Commands.projects");

  const slug = project?.slug;
  const name = slug ? tProjects(`${slug}.name` as never) : "";
  const highlightsKey = `${slug}.highlights` as never;
  const highlights =
    slug && tProjects.has(highlightsKey)
      ? (tProjects.raw(highlightsKey) as string[])
      : [];
  const host = project?.url?.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <DetailDialog
      open={open && project !== null}
      onClose={onClose}
      title={name}
      description={host}
      link={
        project?.url
          ? {
              href: project.url,
              title: tCommands("visit"),
              label: tCommands("openLabel", { name }),
            }
          : undefined
      }
      closeLabel={tCommands("close")}
    >
      {project && slug ? (
        <div className="space-y-4">
          <ProjectImage
            project={project}
            name={name}
            sizes="(max-width: 640px) 100vw, 512px"
            className="rounded-lg border border-border/50 dark:border-overlay-medium"
          />
          <p className="text-muted-foreground text-xs leading-relaxed">
            {tProjects(`${slug}.description` as never)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Tag key={tag} label={tag} variant="teal" />
            ))}
          </div>
          {highlights.length > 0 && (
            <DetailSection title={tCommands("highlights")}>
              <DetailBullets items={highlights} />
            </DetailSection>
          )}
        </div>
      ) : null}
    </DetailDialog>
  );
}

function CProjects() {
  const tProjects = useTranslations("CV.projects");
  const tCommands = useTranslations("Commands.projects");
  const grep = useGrep();
  const grepRaw = useGrepRaw();
  const [selected, setSelected] = useState<ProjectEntry | null>(null);
  const [open, setOpen] = useState(false);

  const visibleProjects = PROJECTS.filter((project) => {
    if (!grep) return true;
    const name = tProjects(`${project.slug}.name` as never) as string;
    const description = tProjects(
      `${project.slug}.description` as never,
    ) as string;
    const highlightsKey = `${project.slug}.highlights` as never;
    const highlights = tProjects.has(highlightsKey)
      ? (tProjects.raw(highlightsKey) as string[])
      : [];
    const haystack = [name, description, ...highlights, ...project.tags].join(
      "   ",
    );
    return matchesGrep(haystack, grep);
  });

  if (grep && visibleProjects.length === 0) {
    return (
      <AnimatedSpan>
        <p className="text-muted-foreground text-xs">
          {tCommands("noMatches", { pattern: grepRaw })}
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <>
      <RevealGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visibleProjects.map((project) => {
          const name = tProjects(`${project.slug}.name` as never);
          return (
            <button
              key={project.slug}
              type="button"
              onClick={() => {
                setSelected(project);
                setOpen(true);
              }}
              aria-label={tCommands("details", { name })}
              className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-border/60 text-start transition-colors hover:border-primary/50 dark:border-overlay-medium"
            >
              <ProjectImage
                project={project}
                name={name}
                sizes="(max-width: 640px) 100vw, 320px"
                className="w-full border-border/60 border-b dark:border-overlay-medium"
              />
              <div className="flex flex-1 flex-col gap-2 p-3">
                <p className="font-semibold text-sm">{name}</p>
                <p className="line-clamp-2 text-muted-foreground text-xs">
                  {tProjects(`${project.slug}.description` as never)}
                </p>
                <div className="mt-auto flex flex-wrap gap-1 pt-1">
                  {project.tags.map((tag) => (
                    <Tag key={tag} label={tag} variant="teal" />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </RevealGroup>
      <ProjectDialog
        project={selected}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default CProjects;
