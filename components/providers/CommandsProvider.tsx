"use client";

import { createContext, useContext, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { MAX_SESSIONS } from "@/lib/utils/terminal.utils";
import { useTerminalSessionsStore } from "@/stores/terminal-sessions.store";
import type { SessionSnapshot, SessionTab } from "@/types/terminal";

type CommandsContextType = {
  commands: SessionSnapshot["commands"];
  showWelcome: boolean;
  sessionSnapshots: SessionSnapshot[];
  sessionTabs: SessionTab[];
  activeSessionId: string;
  setActiveSession: (id: string) => void;
  createSession: () => void;
  closeSession: (id: string) => void;
  renameSession: (id: string, name: string) => void;
  canCreateSession: boolean;
  addCommand: (input: string) => void;
  clearCommands: () => void;
  reset: () => void;
};

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
  const {
    sessions,
    activeSessionId,
    addCommand,
    clearCommands,
    reset,
    setActiveSession,
    createSession,
    closeSession,
    renameSession,
  } = useTerminalSessionsStore(
    useShallow((state) => ({
      sessions: state.sessions,
      activeSessionId: state.activeSessionId,
      addCommand: state.addCommand,
      clearCommands: state.clearCommands,
      reset: state.resetActiveSession,
      setActiveSession: state.setActiveSession,
      createSession: state.createSessionTab,
      closeSession: state.closeSession,
      renameSession: state.renameSession,
    })),
  );

  const activeSession = useMemo(
    () =>
      sessions.find((session) => session.id === activeSessionId) ?? sessions[0],
    [sessions, activeSessionId],
  );

  const sessionTabs = useMemo<SessionTab[]>(
    () =>
      sessions.map((session) => ({
        id: session.id,
        name: session.name,
        commandCount: session.commands.length,
      })),
    [sessions],
  );

  const sessionSnapshots = useMemo<SessionSnapshot[]>(
    () =>
      sessions.map((session) => ({
        id: session.id,
        showWelcome: session.showWelcome,
        commands: session.commands,
      })),
    [sessions],
  );

  const commandsState = useMemo<CommandsContextType>(
    () => ({
      commands: activeSession?.commands ?? [],
      showWelcome: activeSession?.showWelcome ?? true,
      sessionSnapshots,
      sessionTabs,
      activeSessionId,
      setActiveSession,
      createSession,
      closeSession,
      renameSession,
      canCreateSession: sessions.length < MAX_SESSIONS,
      addCommand,
      clearCommands,
      reset,
    }),
    [
      activeSession,
      sessionSnapshots,
      sessionTabs,
      activeSessionId,
      setActiveSession,
      createSession,
      closeSession,
      renameSession,
      sessions.length,
      addCommand,
      clearCommands,
      reset,
    ],
  );

  return (
    <CommandsContext.Provider value={commandsState}>
      {children}
    </CommandsContext.Provider>
  );
}
