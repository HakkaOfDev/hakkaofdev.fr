import Image from "next/image";
import Link from "next/link";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { PROJECTS } from "@/lib/constants";

function CProjects() {
  return (
    <AnimatedSpan className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {PROJECTS.map((project) => (
        <Link
          href={project.url}
          key={project.name}
          aria-label={`Open project: ${project.name}`}
          target="_blank"
          className="group h-auto"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-lg border">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.name}
                className="object-cover transition-all duration-300 group-hover:scale-105"
                fill
              />
            </div>
            <div className="flex flex-col justify-start p-3">
              <p className="font-semibold text-sm">{project.name}</p>
              <p className="mt-1 text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {project.tags
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
        </Link>
      ))}
    </AnimatedSpan>
  );
}

export default CProjects;
