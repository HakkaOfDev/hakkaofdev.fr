import { AnimatedSpan } from "../AnimatedComponents";

function CommandBash({ input, timestamp }: { input: string; timestamp: Date }) {
  return (
    <AnimatedSpan>
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-chart-1 font-bold text-sm select-none shrink-0">
            ❯
          </span>
          <span className="font-semibold text-sm font-mono truncate">
            {input}
          </span>
        </div>
        <span className="text-muted-foreground/50 text-[10px] tabular-nums font-mono shrink-0 tracking-wide">
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
