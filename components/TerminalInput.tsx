"use client";

import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { useCommandHistory } from "@/hooks/useCommandHistory";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useInputHandlers } from "@/hooks/useInputHandlers";
import { useSuggestions } from "@/hooks/useSuggestions";
import { cn } from "@/lib/utils";
import { useCommands } from "./providers/CommandsProvider";
import SuggestionList from "./SuggestionList";

function TerminalInput() {
  const { addCommand, clearCommands, reset } = useCommands();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { navigateHistory, resetHistory } = useCommandHistory(value, setValue);

  const {
    suggestions,
    isOpen,
    safeActiveIndex,
    openPopover,
    closePopover,
    moveActiveIndex,
    applyTabCompletion,
    applyActiveSuggestion,
    applySuggestion,
  } = useSuggestions(value, setValue);

  useGlobalShortcuts({
    clearCommands,
    reset,
    setValue,
    resetHistory,
    closePopover,
  });

  const { handleSubmit, handleKeyDown, handleChange, handleFocus } =
    useInputHandlers({
      value,
      setValue,
      addCommand,
      navigateHistory,
      resetHistory,
      isOpen,
      activeIndex: safeActiveIndex,
      suggestionsCount: suggestions.length,
      openPopover,
      closePopover,
      moveActiveIndex,
      applyTabCompletion,
      applyActiveSuggestion,
      hasSuggestions: suggestions.length > 0,
    });

  return (
    <div className="relative">
      {isOpen && (
        <SuggestionList
          suggestions={suggestions}
          activeIndex={safeActiveIndex}
          query={value.trim().toLowerCase()}
          onSelect={(idx) => {
            applySuggestion(idx);
            inputRef.current?.focus();
          }}
        />
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="shrink-0 select-none font-bold text-primary text-sm">
          ❯
        </span>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="type a command..."
          className="terminal-input min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:font-normal placeholder:text-muted-foreground/30"
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoComplete="off"
          ref={inputRef}
        />

        <button
          type="submit"
          className={cn(
            "flex aspect-square w-6 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-200",
            value.length > 0
              ? "text-muted-foreground/60 hover:bg-primary/10 hover:text-primary"
              : "pointer-events-none opacity-0",
          )}
          aria-label="Submit Command"
          disabled={value.length === 0}
        >
          <ArrowRight size={14} />
          <span className="sr-only">Submit Command</span>
        </button>
      </form>
    </div>
  );
}

export default TerminalInput;
