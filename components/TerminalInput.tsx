"use client";

import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { useCommands } from "./CommandsProvider";
import { useCommandHistory } from "@/hooks/useCommandHistory";
import { useSuggestions } from "@/hooks/useSuggestions";
import { useInputHandlers } from "@/hooks/useInputHandlers";
import SuggestionList from "./SuggestionList";

function TerminalInput() {
  const { addCommand } = useCommands();
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
      <form onSubmit={handleSubmit}>
        {isOpen && (
          <SuggestionList
            suggestions={suggestions}
            activeIndex={safeActiveIndex}
            onSelect={(idx) => {
              applySuggestion(idx);
              inputRef.current?.focus();
            }}
          />
        )}

        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Type 'help' or your command here..."
          className="outline-none bg-transparent border w-full h-10 p-2 pr-10 rounded-md text-base md:text-sm"
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoComplete="off"
          ref={inputRef}
        />

        <button
          type="submit"
          className="absolute right-2 top-1/2 hover:bg-accent rounded-full aspect-square w-7 transition-colors duration-200 cursor-pointer flex items-center justify-center -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Submit Command"
          disabled={value.length === 0}
        >
          <ArrowRight size={16} />
          <span className="sr-only">Submit Command</span>
        </button>
      </form>
    </div>
  );
}

export default TerminalInput;
