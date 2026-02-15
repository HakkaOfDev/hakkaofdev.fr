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
        <span className="text-xs font-semibold text-muted-foreground">
          {title}
        </span>
        <div className="h-px flex-1 bg-border/70" />
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
      <p className="text-xs font-semibold text-muted-foreground pt-0.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export { ShortcutSection, ShortcutRow };
