import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Suggestion, SuggestionGroup } from "@/hooks/useSuggestions";
import { Tag } from "./ui/Tag";

interface SuggestionListProps {
  suggestions: Suggestion[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const GROUP_TAG_VARIANT: Record<
  SuggestionGroup,
  "teal" | "gold" | "purple" | "default"
> = {
  Work: "teal",
  Profile: "gold",
  Spotify: "purple",
  Commands: "default",
};

function SuggestionList({
  suggestions,
  activeIndex,
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
      className="absolute left-0 right-0 bottom-full mb-2 rounded-lg border border-border bg-background/95 backdrop-blur p-1 shadow-lg max-h-44 overflow-auto"
    >
      {suggestions.map((s, idx) => (
        <button
          key={s.value}
          ref={(el) => {
            if (el) {
              itemRefs.current.set(idx, el);
            } else {
              itemRefs.current.delete(idx);
            }
          }}
          type="button"
          role="option"
          aria-selected={idx === activeIndex}
          className={cn(
            "w-full text-left rounded-md px-2 py-1.5 transition-colors",
            idx === activeIndex
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/70",
          )}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(idx)}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-sm font-semibold">{s.value}</span>
            <Tag label={s.group} variant={GROUP_TAG_VARIANT[s.group]} />
          </div>
          {s.description && (
            <div className="text-xs text-muted-foreground line-clamp-1">
              {s.description}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

export default SuggestionList;
