"use client";

import type { ReactNode } from "react";

/** A single toggle pill. `aria-pressed` exposes its on/off state to a11y + tests. */
export function Chip({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`rounded-full border px-2 py-0.5 font-mono text-[11px] transition-colors duration-150 ${
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border/60 bg-transparent text-muted-foreground/80 hover:border-primary/30 hover:text-foreground dark:border-overlay-medium"
      }`}
    >
      {label}
    </button>
  );
}

/** Small link-style control (all / none / reset). */
function ParamControl({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wider transition-colors hover:text-foreground"
    >
      {label}
    </button>
  );
}

/**
 * A selectable CV parameter: the query-param label, a live `selected / total`
 * count, `all · none · reset` controls, and a wrap of chips (passed as children,
 * so skills can render their grouped layout while experiences/projects stay flat).
 */
export function CvParamSection({
  paramName,
  label,
  selectedCount,
  total,
  controls,
  onAll,
  onNone,
  onReset,
  children,
}: {
  paramName: string;
  label: string;
  selectedCount: number;
  total: number;
  controls: { all: string; none: string; reset: string };
  onAll: () => void;
  onNone: () => void;
  onReset: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset
      className="grid grid-cols-1 items-start gap-x-3 gap-y-1 sm:grid-cols-[140px_1fr]"
      aria-label={label}
    >
      <div className="flex flex-col">
        <span className="font-mono text-foreground text-xs">{paramName}</span>
        <span className="text-[10px] text-muted-foreground/70">
          query · string[]
        </span>
      </div>
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="rounded bg-overlay-subtle px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground tabular-nums">
            {selectedCount} / {total}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <ParamControl label={controls.all} onClick={onAll} />
            <span className="text-muted-foreground/30">·</span>
            <ParamControl label={controls.none} onClick={onNone} />
            <span className="text-muted-foreground/30">·</span>
            <ParamControl label={controls.reset} onClick={onReset} />
          </div>
        </div>
        <div className="flex flex-wrap gap-1">{children}</div>
      </div>
    </fieldset>
  );
}
