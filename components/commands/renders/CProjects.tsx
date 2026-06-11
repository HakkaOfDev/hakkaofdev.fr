"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatedSpan, RevealGroup } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { PROJECTS } from "@/lib/constants";
import { matchesGrep } from "@/lib/utils/grep.utils";

function CProjects() {
  const tProjects = useTranslations("CV.projects");
  const tCommands = useTranslations("Commands.projects");
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const visibleProjects = PROJECTS.filter((project) => {
    if (!grep) return true;
    const name = tProjects(`${project.slug}.name` as never) as string;
    const description = tProjects(
      `${project.slug}.description` as never,
    ) as string;
    const haystack = [name, description, ...project.tags].join("   ");
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
    <RevealGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {visibleProjects.map((project) => {
        const name = tProjects(`${project.slug}.name` as never);
        const description = tProjects(`${project.slug}.description` as never);
        const content = (
          <div className="flex h-full flex-col overflow-hidden rounded-lg border">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={name}
                className={
                  project.url
                    ? "object-cover transition-all duration-300 group-hover:scale-105"
                    : "object-cover"
                }
                sizes="(max-width: 768px) 100vw, 50vw"
                fill
              />
            </div>
            <div className="flex flex-col justify-start p-3">
              <p className="font-semibold text-sm">{name}</p>
              <p className="mt-1 text-muted-foreground">{description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {project.tags
                  .slice()
                  .sort((a, b) => a.localeCompare(b))
                  .map((tag) => (
                    <p
                      key={tag}
                      className="rounded-xs bg-primary/10 px-2 py-1 text-primary text-xs"
                    >
                      {tag}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        );

        if (!project.url) {
          return (
            <div key={project.slug} className="h-auto">
              {content}
            </div>
          );
        }

        return (
          <Link
            href={project.url}
            key={project.slug}
            aria-label={tCommands("openLabel", { name })}
            target="_blank"
            className="group h-auto"
          >
            {content}
          </Link>
        );
      })}
    </RevealGroup>
  );
}

export default CProjects;
