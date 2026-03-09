"use client";

import { createContext, useContext } from "react";
import { useTerminalState } from "@/hooks/useTerminalState";

type TerminalContextType = ReturnType<typeof useTerminalState>;

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
  const terminalState = useTerminalState();
  return (
    <TerminalContext.Provider value={terminalState}>
      {children}
    </TerminalContext.Provider>
  );
}
