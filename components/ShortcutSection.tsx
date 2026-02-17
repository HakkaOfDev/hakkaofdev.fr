import { cn } from "@/lib/utils";

/* ─── Section wrapper (heading + divider + rows) ─── */

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
        <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-widest">
          {title}
        </span>
        <div className="h-px flex-1 bg-border/40 dark:bg-white/[0.06]" />
      </div>

      <div className="grid gap-2">{children}</div>
    </div>
  );
}

/* ─── Single row (label + content) ─── */

function ShortcutRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("grid grid-cols-[64px_1fr] gap-4 items-start", className)}
    >
      <p className="text-[11px] font-medium text-muted-foreground/80 pt-0.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export { ShortcutSection, ShortcutRow };
