import { AnimatedSpan } from "../AnimatedComponents";

function CommandBash({ input, timestamp }: { input: string; timestamp: Date }) {
  return (
    <AnimatedSpan>
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 select-none font-bold text-primary text-sm">
            ❯
          </span>
          <span className="truncate font-mono font-semibold text-sm">
            {input}
          </span>
        </div>
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground/50 tabular-nums tracking-wide">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
    </AnimatedSpan>
  );
}

export default CommandBash;
