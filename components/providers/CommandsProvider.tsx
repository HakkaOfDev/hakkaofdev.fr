"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Command } from "@/types";

interface CommandsContextType {
  showWelcome: boolean;
  commands: Command[];
  addCommand: (input: string) => void;
  clearCommands: () => void;
  reset: () => void;
}

const CommandsContext = createContext<CommandsContextType | undefined>(
  undefined,
);

export function useCommands() {
  const context = useContext(CommandsContext);
  if (!context) {
    throw new Error("useCommands must be used within a CommandsProvider");
  }
  return context;
}

export function CommandsProvider({ children }: { children: React.ReactNode }) {
  const [commands, setCommands] = useState<Command[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);

  const addCommand = (input: string) => {
    if (showWelcome) setShowWelcome(false);

    const normalizedInput = input.trim().toLowerCase();
    if (!normalizedInput) return;

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const timestamp = new Date();

    setCommands((prev) => [
      ...prev,
      {
        id,
        input: normalizedInput,
        timestamp,
      },
    ]);
  };

  const clearCommands = useCallback(() => {
    setCommands([]);
  }, []);

  const reset = useCallback(() => {
    setCommands([]);
    setShowWelcome(true);
  }, []);

  return (
    <CommandsContext.Provider
      value={{
        commands,
        addCommand,
        clearCommands,
        showWelcome,
        reset,
      }}
    >
      {children}
    </CommandsContext.Provider>
  );
}
