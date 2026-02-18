import { AnimatedSpan } from "@/components/AnimatedComponents";

export function ReadSkeleton() {
  return (
    <AnimatedSpan className="gap-0">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border-l-2 border-muted/40 pl-4 relative pb-3 animate-pulse"
        >
          <div className="absolute -left-[5px] top-[5px] size-2 rounded-full bg-muted" />
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-6 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-2.5 w-28 rounded bg-muted ml-auto" />
          </div>
          <div className="mt-1.5 h-3 w-3/4 rounded bg-muted" />
        </div>
      ))}
    </AnimatedSpan>
  );
}
