"use client";

import { Search, X } from "lucide-react";
import type { RefObject } from "react";

interface TerminalSearchBarProps {
  inputRef: RefObject<HTMLInputElement | null>;
  outputQuery: string;
  setOutputQuery: (value: string) => void;
  closeSearch: () => void;
}

function TerminalSearchBar({
  inputRef,
  outputQuery,
  setOutputQuery,
  closeSearch,
}: TerminalSearchBarProps) {
  return (
    <div className="flex items-center gap-2 border-border/40 border-b bg-muted/25 px-3 py-2 dark:border-overlay-subtle dark:bg-overlay-subtle/70">
      <Search size={12} className="shrink-0 text-muted-foreground/70" />

      <input
        ref={inputRef}
        value={outputQuery}
        onChange={(event) => setOutputQuery(event.target.value.toLowerCase())}
        placeholder="Filter command history..."
        className="min-w-0 flex-1 bg-transparent font-mono text-[12px] outline-none placeholder:text-muted-foreground/40"
      />

      <button
        type="button"
        className="rounded p-1 text-muted-foreground/70 transition-colors hover:bg-muted/60 hover:text-foreground dark:hover:bg-overlay-medium"
        onClick={closeSearch}
        aria-label="Hide search"
        title="Hide search"
      >
        <X size={12} />
      </button>
    </div>
  );
}

export { TerminalSearchBar };
