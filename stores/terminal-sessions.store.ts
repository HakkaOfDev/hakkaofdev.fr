"use client";

import {
  clampScrollbackLimit,
  createId,
  createSession,
  createSessionName,
  MAX_SESSIONS,
  normalizeTabName,
} from "@/lib/utils/terminal.utils";
import { useTerminalPreferencesStore } from "@/stores/terminal-preferences.store";
import type { CommandSession } from "@/types/terminal";
import { create } from "zustand";

type TerminalSessionsStore = {
  sessions: CommandSession[];
  activeSessionId: string;
  addCommand: (input: string) => void;
  clearCommands: () => void;
  resetActiveSession: () => void;
  setActiveSession: (id: string) => void;
  createSessionTab: () => void;
  closeSession: (id: string) => void;
  renameSession: (id: string, name: string) => void;
  trimCommandsToScrollback: (limit: number) => void;
};

function createInitialSessionState(): Pick<
  TerminalSessionsStore,
  "activeSessionId" | "sessions"
> {
  const initialSession = createSession([]);
  return {
    sessions: [initialSession],
    activeSessionId: initialSession.id,
  };
}

export const useTerminalSessionsStore = create<TerminalSessionsStore>()((set) => ({
  ...createInitialSessionState(),
  addCommand: (input) =>
    set((state) => {
      const normalizedInput = input.trim().toLowerCase();
      if (!normalizedInput) return state;
      const scrollbackLimit = useTerminalPreferencesStore.getState().scrollbackLimit;

      const nextCommand = {
        id: createId(),
        input: normalizedInput,
        timestamp: new Date(),
      };

      return {
        sessions: state.sessions.map((session) =>
          session.id === state.activeSessionId
            ? {
                ...session,
                showWelcome: false,
                commands: [...session.commands, nextCommand].slice(-scrollbackLimit),
              }
            : session,
        ),
      };
    }),
  clearCommands: () =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === state.activeSessionId ? { ...session, commands: [] } : session,
      ),
    })),
  resetActiveSession: () =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === state.activeSessionId
          ? { ...session, commands: [], showWelcome: true }
          : session,
      ),
    })),
  setActiveSession: (id) =>
    set((state) => {
      if (state.activeSessionId === id) return state;
      if (!state.sessions.some((session) => session.id === id)) {
        return state;
      }
      return { activeSessionId: id };
    }),
  createSessionTab: () =>
    set((state) => {
      if (state.sessions.length >= MAX_SESSIONS) return state;

      const nextSessionId = createId();

      return {
        sessions: [
          ...state.sessions,
          {
            id: nextSessionId,
            name: createSessionName(state.sessions),
            showWelcome: true,
            commands: [],
          },
        ],
        activeSessionId: nextSessionId,
      };
    }),
  closeSession: (id) =>
    set((state) => {
      if (state.sessions.length <= 1) return state;

      const index = state.sessions.findIndex((session) => session.id === id);
      if (index === -1) return state;

      const nextSessions = state.sessions.filter((session) => session.id !== id);

      let nextActiveSessionId = state.activeSessionId;
      if (id === state.activeSessionId) {
        nextActiveSessionId =
          state.sessions[index - 1]?.id ??
          state.sessions[index + 1]?.id ??
          nextSessions[0]?.id ??
          state.activeSessionId;
      }

      return {
        sessions: nextSessions,
        activeSessionId: nextActiveSessionId,
      };
    }),
  renameSession: (id, name) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id
          ? { ...session, name: normalizeTabName(name, session.name) }
          : session,
      ),
    })),
  trimCommandsToScrollback: (limit) =>
    set((state) => {
      const nextLimit = clampScrollbackLimit(limit);
      return {
        sessions: state.sessions.map((session) => ({
          ...session,
          commands: session.commands.slice(-nextLimit),
        })),
      };
    }),
}));
