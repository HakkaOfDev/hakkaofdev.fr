"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CLOSE_MESSAGES } from "@/lib/constants";
import { useCommands } from "./CommandsProvider";

interface TerminalContextType {
  isMinimized: boolean;
  isMaximized: boolean;
  handleClose: () => void;
  handleMinimize: () => void;
  handleMaximize: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(
  undefined,
);

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
}

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const { addCommand } = useCommands();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleClose = useCallback(() => {
    if (isMinimized) setIsMinimized(false);
    const msg =
      CLOSE_MESSAGES[Math.floor(Math.random() * CLOSE_MESSAGES.length)];
    addCommand(`echo "${msg}"`);
  }, [addCommand, isMinimized]);

  const handleMinimize = useCallback(() => {
    setIsMinimized((v) => !v);
  }, []);

  const handleMaximize = useCallback(() => {
    if (isMinimized) setIsMinimized(false);
    setIsMaximized((v) => !v);
  }, [isMinimized]);

  return (
    <TerminalContext.Provider
      value={{
        isMinimized,
        isMaximized,
        handleClose,
        handleMinimize,
        handleMaximize,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}
