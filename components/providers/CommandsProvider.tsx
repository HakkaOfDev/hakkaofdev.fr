"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
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
  const pendingScrollId = useRef<number | null>(null);

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

    if (pendingScrollId.current) window.clearTimeout(pendingScrollId.current);
    pendingScrollId.current = window.setTimeout(() => {
      const command = document.getElementById(`cmd-${id}`);

      if (command) {
        command.scrollIntoView({ behavior: "smooth", inline: "start" });
      }
    }, 500);
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
