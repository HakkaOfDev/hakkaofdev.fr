import { Fragment } from "react";
import { cn } from "@/lib/utils";

/* ─── Section wrapper (heading + divider + shared row grid) ─── */

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

      {/*
        Single grid shared by every <ShortcutRow>: the label column sizes to
        the widest label across rows, so locales with longer translations
        (ru "Дополнительно", nl "Hulpmiddelen", ja "ユーティリティ", …) don't
        crowd the shortcuts on the right.
      */}
      <div className="grid grid-cols-[max-content_1fr] items-start gap-x-4 gap-y-2">
        {children}
      </div>
    </div>
  );
}

/* ─── Single row (label + shortcuts) — flows directly into parent grid ─── */

function ShortcutRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <p className="pt-0.5 font-medium text-[11px] text-muted-foreground/80">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </Fragment>
  );
}

export { ShortcutSection, ShortcutRow };
