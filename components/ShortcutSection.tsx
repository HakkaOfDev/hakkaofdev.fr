import { cn } from "@/lib/utils";

/* ─── Section wrapper (heading + divider) ─── */

function ShortcutSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center gap-2" aria-hidden>
        <span className="font-semibold text-[10px] text-muted-foreground/80 uppercase tracking-widest">
          {title}
        </span>
        <div className="h-px flex-1 bg-border/40 dark:bg-overlay-medium" />
      </div>

      <div className="grid gap-2">{children}</div>
    </div>
  );
}

/* ─── Single row (label + shortcuts) ─── */

function ShortcutRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-start gap-4">
      <p className="pt-0.5 font-medium text-[11px] text-muted-foreground/80">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export { ShortcutRow, ShortcutSection };
