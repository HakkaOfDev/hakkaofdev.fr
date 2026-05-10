import { AnimatedSpan } from "@/components/AnimatedComponents";

const RANGE_PILL = (
  <div className="inline-flex animate-pulse items-center gap-1.5 rounded-full bg-muted/40 px-2 py-0.5 ring-1 ring-border/40 ring-inset">
    <div className="size-2.5 rounded-full bg-muted" />
    <div className="h-2.5 w-20 rounded bg-muted" />
  </div>
);

function TitleStub() {
  return (
    <div className="flex animate-pulse items-center gap-1.5">
      <div className="size-3 rounded bg-muted" />
      <div className="h-2.5 w-28 rounded bg-muted" />
    </div>
  );
}

export function CountriesSkeleton() {
  return (
    <AnimatedSpan className="gap-3">
      {RANGE_PILL}
      <TitleStub />
      <div className="grid h-60 w-full max-w-xl animate-pulse grid-cols-[64px_1fr] gap-2 rounded-md bg-muted/20 p-3 ring-1 ring-border/40 ring-inset">
        <div className="grid gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-3 rounded bg-muted" />
          ))}
        </div>
        <div className="grid gap-2">
          {[100, 75, 60, 45, 32, 24, 18].map((w) => (
            <div
              key={w}
              className="h-3 rounded bg-muted"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    </AnimatedSpan>
  );
}

export function BrowsersSkeleton() {
  return (
    <AnimatedSpan className="gap-3">
      {RANGE_PILL}
      <TitleStub />
      <div className="grid max-w-xl grid-cols-1 items-center gap-3 sm:grid-cols-[200px_1fr]">
        <div className="mx-auto flex size-40 animate-pulse items-center justify-center rounded-full bg-muted/30 ring-1 ring-border/40 ring-inset">
          <div className="size-20 rounded-full bg-background ring-1 ring-border/40 ring-inset" />
        </div>
        <div className="grid animate-pulse gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[12px_1fr_auto] items-center gap-2"
            >
              <div className="size-3 rounded-sm bg-muted" />
              <div className="h-2.5 rounded bg-muted" />
              <div className="h-2.5 w-12 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </AnimatedSpan>
  );
}

export function ReferrersSkeleton() {
  return (
    <AnimatedSpan className="gap-3">
      {RANGE_PILL}
      <TitleStub />
      <div className="grid h-60 w-full max-w-xl animate-pulse grid-cols-[140px_1fr] gap-2 rounded-md bg-muted/20 p-3 ring-1 ring-border/40 ring-inset">
        <div className="grid gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-3 rounded bg-muted" />
          ))}
        </div>
        <div className="grid gap-2">
          {[100, 80, 65, 50, 38, 28, 20].map((w) => (
            <div
              key={w}
              className="h-3 rounded bg-muted"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    </AnimatedSpan>
  );
}

export function TrendSkeleton() {
  return (
    <AnimatedSpan className="gap-3">
      {RANGE_PILL}
      <TitleStub />
      <div className="grid max-w-xl animate-pulse grid-cols-3 gap-2">
        {[
          "bg-primary/8 ring-primary/20",
          "bg-secondary/8 ring-secondary/20",
          "bg-tertiary/8 ring-tertiary/20",
        ].map((tone) => (
          <div
            key={tone}
            className={`rounded-md px-3 py-2 ring-1 ring-inset ${tone}`}
          >
            <div className="h-2 w-12 rounded bg-muted" />
            <div className="mt-1 h-3 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="relative h-44 w-full max-w-xl animate-pulse overflow-hidden rounded-md bg-muted/20 ring-1 ring-border/40 ring-inset">
        <svg
          className="absolute inset-0 h-full w-full text-muted"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <title>Loading chart</title>
          <path
            d="M0,32 L8,28 L16,30 L24,22 L32,24 L40,18 L48,20 L56,12 L64,16 L72,10 L80,14 L88,8 L96,12 L100,10 L100,40 L0,40 Z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M0,32 L8,28 L16,30 L24,22 L32,24 L40,18 L48,20 L56,12 L64,16 L72,10 L80,14 L88,8 L96,12 L100,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.6"
          />
        </svg>
      </div>
    </AnimatedSpan>
  );
}
