import { AnimatedSpan } from "@/components/AnimatedComponents";

export function ReadSkeleton() {
  return (
    <AnimatedSpan className="gap-0">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative animate-pulse border-muted/40 border-s-2 ps-4 pb-3"
        >
          <div className="absolute -start-[5px] top-[5px] size-2 rounded-full bg-muted" />
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-6 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="ms-auto h-2.5 w-28 rounded bg-muted" />
          </div>
          <div className="mt-1.5 h-3 w-3/4 rounded bg-muted" />
        </div>
      ))}
    </AnimatedSpan>
  );
}
