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
        <span className="font-semibold text-[10px] text-muted-foreground/80 uppercase tracking-widest">
          {title}
        </span>
        <div className="h-px flex-1 bg-border/40 dark:bg-overlay-medium" />
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
      className={cn("grid grid-cols-[64px_1fr] items-start gap-4", className)}
    >
      <p className="pt-0.5 font-medium text-[11px] text-muted-foreground/80">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export { ShortcutSection, ShortcutRow };
