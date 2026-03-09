import { AnimatedSpan } from "../AnimatedComponents";

function CommandBash({ input, timestamp }: { input: string; timestamp: Date }) {
  return (
    <AnimatedSpan>
      <div className="flex w-full min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <span className="shrink-0 select-none font-bold text-primary text-sm">
            ❯
          </span>
          <span className="block min-w-0 flex-1 truncate font-mono font-semibold text-sm">
            {input}
          </span>
        </div>
        <span className="shrink-0 font-mono text-muted-foreground/50 text-xs tabular-nums tracking-wide">
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
