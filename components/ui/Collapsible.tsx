"use client";

import { ChevronRight } from "lucide-react";
import type * as React from "react";
import { createContext, use, useCallback, useId, useState } from "react";

import { cn } from "@/lib/utils";

type CollapsibleContextValue = {
  open: boolean;
  toggle: () => void;
  contentId: string;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible(): CollapsibleContextValue {
  const ctx = use(CollapsibleContext);
  if (!ctx)
    throw new Error("Collapsible parts must be used inside <Collapsible>");
  return ctx;
}

/**
 * Headless-ish disclosure. Works controlled (`open` + `onOpenChange`) or
 * uncontrolled (`defaultOpen`). Compose with `CollapsibleTrigger` and
 * `CollapsibleContent` so the trigger can sit next to other controls.
 */
function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "onToggle"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const contentId = useId();

  const toggle = useCallback(() => {
    const next = !open;
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  }, [open, openProp, onOpenChange]);

  return (
    <CollapsibleContext value={{ open, toggle, contentId }}>
      <div
        data-slot="collapsible"
        data-state={open ? "open" : "closed"}
        className={className}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext>
  );
}

/** Button that toggles the parent `Collapsible`, with a rotating chevron. */
function CollapsibleTrigger({
  className,
  children,
  hideChevron = false,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { hideChevron?: boolean }) {
  const { open, toggle, contentId } = useCollapsible();

  return (
    <button
      type="button"
      data-slot="collapsible-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-controls={contentId}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) toggle();
      }}
      className={cn(
        "group/collapsible inline-flex cursor-pointer items-center gap-1.5 text-left",
        className,
      )}
      {...props}
    >
      {!hideChevron && (
        <ChevronRight
          aria-hidden
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
        />
      )}
      {children}
    </button>
  );
}

/**
 * Animates height via the `grid-template-rows: 0fr → 1fr` trick. Content stays
 * mounted (state is preserved) but is `inert` while closed. `className` goes
 * on the innermost wrapper so padding/borders don't leak when collapsed.
 */
function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, contentId } = useCollapsible();

  return (
    <div
      id={contentId}
      data-slot="collapsible-content"
      data-state={open ? "open" : "closed"}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
