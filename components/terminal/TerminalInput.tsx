"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import SuggestionList from "@/components/SuggestionList";
import { useCommandHistory } from "@/hooks/useCommandHistory";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useInputHandlers } from "@/hooks/useInputHandlers";
import { useSuggestions } from "@/hooks/useSuggestions";
import { cn } from "@/lib/utils";
import { useCommands } from "../providers/CommandsProvider";
import { useTerminal } from "../providers/TerminalProvider";

function TerminalInput() {
  const t = useTranslations("Terminal");
  const { addCommand, clearCommands, reset, activeSessionId } = useCommands();
  const { toggleSearch, canSearch, increaseFontScale, decreaseFontScale } =
    useTerminal();
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
    toggleSearch,
    canSearch,
    increaseFontScale,
    decreaseFontScale,
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

  useEffect(() => {
    if (!activeSessionId) return;
    setValue("");
    resetHistory();
    closePopover();
  }, [activeSessionId, resetHistory, closePopover]);

  return (
    <div className="relative">
      {isOpen ? (
        <SuggestionList
          suggestions={suggestions}
          activeIndex={safeActiveIndex}
          query={value.toLowerCase().trimStart()}
          onSelect={(index) => {
            applySuggestion(index);
            inputRef.current?.focus();
          }}
        />
      ) : null}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="mb-1 shrink-0 select-none font-bold text-primary text-sm">
          ❯
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoComplete="off"
          placeholder={t("input.placeholder")}
          className="terminal-input mb-1 min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:font-normal placeholder:text-muted-foreground/30"
        />

        <button
          type="submit"
          className={cn(
            "flex aspect-square w-6 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-200",
            value.length > 0
              ? "text-muted-foreground/60 hover:bg-primary/10 hover:text-primary"
              : "pointer-events-none opacity-0",
          )}
          aria-label={t("input.submit")}
          disabled={value.length === 0}
        >
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
}

export { TerminalInput };
