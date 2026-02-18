import { useEffect, useRef } from "react";
import type { CommandGroup } from "@/components/commands/command-descriptors";
import type { Suggestion } from "@/hooks/useSuggestions";
import { cn } from "@/lib/utils";

/* ─── Group → dot color mapping ─── */

const GROUP_DOT: Record<CommandGroup, string> = {
  Work: "bg-chart-1",
  Profile: "bg-chart-2",
  Guestbook: "bg-pink-500 dark:bg-pink-400",
  Spotify: "bg-chart-3",
  Theme: "bg-chart-5",
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
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const el = itemRefs.current.get(activeIndex);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  return (
    <div
      role="listbox"
      className="absolute left-0 right-0 bottom-full mb-2 rounded-lg border border-border/50 dark:border-white/[0.08] bg-background/98 backdrop-blur-xl shadow-xl dark:shadow-2xl dark:shadow-black/40 max-h-56 overflow-hidden flex flex-col"
    >
      {/* ── Suggestion items ── */}
      <div className="overflow-auto terminal-scrollbar p-1">
        {suggestions.map((s, idx) => {
          const isActive = idx === activeIndex;
          const matchLen = query.length;
          const matched = s.value.slice(0, matchLen);
          const rest = s.value.slice(matchLen);

          return (
            <button
              key={s.value}
              ref={(el) => {
                if (el) itemRefs.current.set(idx, el);
                else itemRefs.current.delete(idx);
              }}
              type="button"
              role="option"
              aria-selected={isActive}
              className={cn(
                "w-full text-left rounded-md px-2.5 py-[7px] transition-all duration-100 group/item border-l-2",
                isActive
                  ? "border-l-chart-1 bg-chart-1/[0.07] dark:bg-chart-1/[0.05]"
                  : "border-l-transparent hover:bg-muted/50 dark:hover:bg-white/[0.03]",
              )}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(idx)}
            >
              <div className="flex items-center gap-2.5">
                {/* Group color dot */}
                <span
                  className={cn(
                    "h-[5px] w-[5px] rounded-full shrink-0 transition-transform duration-100",
                    GROUP_DOT[s.group],
                    isActive && "scale-125",
                  )}
                />

                {/* Command name with match highlight */}
                <span className="font-mono text-[13px] min-w-0 shrink-0">
                  <span className="font-semibold text-foreground">
                    {matched}
                  </span>
                  <span className="text-muted-foreground/60">{rest}</span>
                </span>

                {/* Description */}
                {s.description && (
                  <span className="text-[11px] text-muted-foreground/40 truncate ml-auto pl-3">
                    {s.description}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Keyboard hints footer ── */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-t border-border/30 dark:border-white/[0.05] bg-muted/20 dark:bg-white/[0.02]">
        <span className="text-[10px] text-muted-foreground/40 flex items-center gap-1">
          <kbd className="font-mono text-[9px] bg-muted/60 dark:bg-white/[0.06] px-1 py-px rounded">
            ↑↓
          </kbd>
          navigate
        </span>
        <span className="text-[10px] text-muted-foreground/40 flex items-center gap-1">
          <kbd className="font-mono text-[9px] bg-muted/60 dark:bg-white/[0.06] px-1 py-px rounded">
            Tab
          </kbd>
          complete
        </span>
        <span className="text-[10px] text-muted-foreground/40 flex items-center gap-1">
          <kbd className="font-mono text-[9px] bg-muted/60 dark:bg-white/[0.06] px-1 py-px rounded">
            ↵
          </kbd>
          run
        </span>
      </div>
    </div>
  );
}

export default SuggestionList;
