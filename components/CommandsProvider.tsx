"use client";

import { Command } from "@/types";
import { createContext, useContext, useState } from "react";

interface CommandsContextType {
  showWelcome: boolean;
  commands: Command[];
  addCommand: (input: string) => void;
  clearCommands: () => void;
  reset: () => void;
}

const CommandsContext = createContext<CommandsContextType | undefined>(
  undefined
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
    if (commands.length === 0) {
      setShowWelcome(false);
    }

    const timestamp = new Date();

    setCommands((prev) => [
      ...prev,
      {
        input: input.trimStart().trimEnd(),
        timestamp,
      },
    ]);

    setTimeout(() => {
      const command = document.getElementById(
        `cmd-${input}-${timestamp.getTime()}`
      );

      if (command) {
        command.scrollIntoView({ behavior: "smooth", inline: "start" });
      }
    }, 500);
  };

  const clearCommands = () => {
    setCommands([]);
  };

  const reset = () => {
    setCommands([]);
    setShowWelcome(true);
  };

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
