"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useTerminal } from "@/components/providers/TerminalProvider";
import { Dialog } from "@/components/ui/Dialog";

const ICON_BUTTON_CLASS =
  "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border/60 bg-background/45 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground dark:border-overlay-medium dark:hover:bg-overlay-medium";

export interface DetailDialogLink {
  href: string;
  title: string;
  label: string;
}

/**
 * Terminal-styled details dialog shared by the list commands (projects,
 * experiences): inherits the terminal font and zoom, and carries an optional
 * external link plus the close button in its header.
 */
export function DetailDialog({
  open,
  onClose,
  title,
  description,
  link,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  link?: DetailDialogLink;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const { fontFamilyStack, fontScale } = useTerminal();

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && onClose()}
      title={title}
      description={description}
      headerActions={
        <>
          {link ? (
            <Link
              href={link.href}
              target="_blank"
              className={ICON_BUTTON_CLASS}
              title={link.title}
              aria-label={link.label}
            >
              <ArrowUpRight size={12} />
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className={ICON_BUTTON_CLASS}
            title={closeLabel}
            aria-label={closeLabel}
          >
            <X size={12} />
          </button>
        </>
      }
      className="w-full max-w-lg rounded-xl border-primary/40 bg-background p-4 shadow-primary/5 shadow-xl sm:p-5"
      style={
        {
          "--terminal-font-family": fontFamilyStack,
          "--terminal-zoom": String(fontScale / 100),
          fontFamily: fontFamilyStack,
        } as React.CSSProperties
      }
    >
      {children}
    </Dialog>
  );
}

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2 rounded-xl border border-border/50 bg-background/30 p-3 dark:border-overlay-medium">
      <h3 className="font-medium text-muted-foreground text-xs">{title}</h3>
      {children}
    </section>
  );
}

export function DetailBullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-xs">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden className="text-primary">
            ›
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
