"use client";

import type * as React from "react";
import { createContext, use, useId, useState } from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  select: (value: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error("Tabs parts must be used inside <Tabs>");
  return ctx;
}

const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

/**
 * Accessible tabs (WAI-ARIA tab pattern). Works controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`). Compose with `TabsList`,
 * `TabsTrigger` and `TabsContent`; only the active panel is mounted.
 */
function Tabs({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue"> & {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const baseId = useId();

  const select = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext value={{ value, select, baseId }}>
      <div data-slot="tabs" className={className} {...props}>
        {children}
      </div>
    </TabsContext>
  );
}

const KEY_OFFSETS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

/**
 * Moves focus (and selection) between tabs with the arrow keys, Home and End,
 * flipping the arrows in right-to-left layouts.
 */
function moveBetweenTabs(event: React.KeyboardEvent<HTMLDivElement>) {
  const tabs = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:not(:disabled)',
    ),
  );
  const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
  if (current === -1) return;

  const direction =
    getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1;
  const offset = KEY_OFFSETS[event.key];
  let next: number | undefined;
  if (offset !== undefined) next = current + offset * direction;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = tabs.length - 1;
  if (next === undefined) return;

  event.preventDefault();
  const target = tabs[(next + tabs.length) % tabs.length];
  target.focus();
  target.click();
}

function TabsList({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) moveBetweenTabs(event);
      }}
      className={cn("flex gap-1", className)}
      {...props}
    />
  );
}

function TabsTrigger({
  value,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { value: string }) {
  const { value: active, select, baseId } = useTabs();
  const selected = active === value;

  return (
    <button
      type="button"
      role="tab"
      id={tabId(baseId, value)}
      aria-selected={selected}
      aria-controls={panelId(baseId, value)}
      tabIndex={selected ? 0 : -1}
      data-slot="tabs-trigger"
      data-state={selected ? "active" : "inactive"}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) select(value);
      }}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 font-semibold text-xs transition-colors",
        selected
          ? "bg-primary/10 text-primary ring-1 ring-primary/20 ring-inset"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  value,
  className,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const { value: active, baseId } = useTabs();
  if (active !== value) return null;

  return (
    <div
      role="tabpanel"
      id={panelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      data-slot="tabs-content"
      className={className}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
