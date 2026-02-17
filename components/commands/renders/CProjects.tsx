import Image from "next/image";
import Link from "next/link";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { PROJECTS } from "@/lib/constants";

function CProjects() {
  return (
    <AnimatedSpan className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PROJECTS.map((project) => (
        <Link
          href={project.url}
          key={project.name}
          aria-label={`Open project: ${project.name}`}
          target="_blank"
          className="h-auto group"
        >
          <div className="border rounded-lg h-full overflow-hidden flex flex-col">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.name}
                className="object-cover group-hover:scale-105 transition-all duration-300"
                fill
              />
            </div>
            <div className="flex flex-col justify-start p-3">
              <p className="text-sm font-semibold">{project.name}</p>
              <p className="text-muted-foreground mt-1">
                {project.description}
              </p>
              <div className="flex gap-1 flex-wrap mt-3">
                {project.tags
                  .sort((a, b) => a.localeCompare(b))
                  .map((tag) => (
                    <p
                      key={tag}
                      className="text-xs rounded-xs py-1 px-2 bg-chart-1/10 text-chart-1"
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
