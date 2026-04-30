"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import type { Suggestion } from "@/hooks/useSuggestions";
import type { CommandGroup } from "@/lib/command-descriptors";
import { cn } from "@/lib/utils";

/* ─── Group → dot color mapping ─── */

const GROUP_DOT: Record<CommandGroup, string> = {
  Work: "bg-primary",
  Profile: "bg-secondary",
  Guestbook: "bg-quinary",
  Spotify: "bg-tertiary",
  Theme: "bg-quaternary",
  Terminal: "bg-muted-foreground/50",
};

/* ─── Props ─── */

interface SuggestionListProps {
  suggestions: Suggestion[];
  activeIndex: number;
  query: string;
  onSelect: (index: number) => void;
}

/* ─── Component ─── */

function SuggestionList({
  suggestions,
  activeIndex,
  query,
  onSelect,
}: SuggestionListProps) {
  const t = useTranslations("Suggestions");
  const tCommands = useTranslations("Commands.descriptions");
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const el = itemRefs.current.get(activeIndex);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  return (
    <div
      role="listbox"
      className="absolute right-0 bottom-full left-0 mb-2 flex max-h-56 flex-col overflow-hidden rounded-lg border border-border/50 bg-background/98 shadow-xl backdrop-blur-xl dark:border-overlay-medium dark:shadow-2xl dark:shadow-black/40"
    >
      {/* ── Suggestion items ── */}
      <div className="terminal-scrollbar overflow-auto p-1">
        {suggestions.map((s, idx) => {
          const isActive = idx === activeIndex;
          const matchLen = query.length;
          const matched = s.value.slice(0, matchLen);
          const rest = s.value.slice(matchLen);
          const description = s.slug
            ? tCommands(s.slug as never)
            : undefined;

          return (
            <button
              key={`${s.value}-${idx}`}
              ref={(el) => {
                if (el) itemRefs.current.set(idx, el);
                else itemRefs.current.delete(idx);
              }}
              type="button"
              role="option"
              aria-selected={isActive}
              className={cn(
                "group/item w-full cursor-pointer rounded-md border-l-2 px-2.5 py-[7px] text-left transition-all duration-100",
                isActive
                  ? "border-l-primary bg-primary/[0.07] dark:bg-primary/[0.05]"
                  : "border-l-transparent hover:bg-muted/50 dark:hover:bg-overlay-subtle",
              )}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(idx)}
            >
              <div className="flex items-center gap-2.5">
                {/* Group color dot */}
                <span
                  className={cn(
                    "h-[5px] w-[5px] shrink-0 rounded-full transition-transform duration-100",
                    GROUP_DOT[s.group],
                    isActive && "scale-125",
                  )}
                />

                {/* Command name with match highlight */}
                <span className="min-w-0 shrink-0 font-mono text-[13px]">
                  <span className="font-semibold text-foreground">
                    {matched}
                  </span>
                  <span className="text-muted-foreground/60">{rest}</span>
                </span>

                {/* Description */}
                {description && (
                  <span className="ml-auto truncate pl-3 text-muted-foreground/40 text-xs">
                    {description}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Keyboard hints footer ── */}
      <div className="flex items-center gap-3 border-border/30 border-t bg-muted/20 px-3 py-1.5 dark:border-overlay-subtle dark:bg-overlay-subtle">
        <span className="flex items-center gap-1 text-muted-foreground/40 text-xs">
          <kbd className="rounded bg-muted/60 px-1 py-px font-mono text-xs dark:bg-overlay-medium">
            ↑↓
          </kbd>
          {t("navigate")}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground/40 text-xs">
          <kbd className="rounded bg-muted/60 px-1 py-px font-mono text-xs dark:bg-overlay-medium">
            Tab
          </kbd>
          {t("complete")}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground/40 text-xs">
          <kbd className="rounded bg-muted/60 px-1 py-px font-mono text-xs dark:bg-overlay-medium">
            ↵
          </kbd>
          {t("run")}
        </span>
      </div>
    </div>
  );
}

export default SuggestionList;
