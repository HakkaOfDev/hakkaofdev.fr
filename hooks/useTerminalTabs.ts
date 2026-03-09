import { useEffect, useRef, useState } from "react";
import type { SessionTab } from "@/types/terminal";

interface UseTerminalTabsOptions {
  sessionTabs: SessionTab[];
  activeSessionId: string;
  setActiveSession: (id: string) => void;
  createSession: () => void;
  closeSession: (id: string) => void;
  renameSession: (id: string, name: string) => void;
}

export function useTerminalTabs({
  sessionTabs,
  activeSessionId,
  setActiveSession,
  createSession,
  closeSession,
  renameSession,
}: UseTerminalTabsOptions) {
  const outputViewportRef = useRef<HTMLPreElement | null>(null);
  const sessionScrollPositionsRef = useRef<Record<string, number>>({});
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState("");

  useEffect(() => {
    const activeIds = new Set(sessionTabs.map((session) => session.id));
    for (const id of Object.keys(sessionScrollPositionsRef.current)) {
      if (!activeIds.has(id)) delete sessionScrollPositionsRef.current[id];
    }
    if (editingTabId && !activeIds.has(editingTabId)) {
      setEditingTabId(null);
      setEditingTabName("");
    }
  }, [editingTabId, sessionTabs]);

  useEffect(() => {
    const viewport = outputViewportRef.current;
    if (!viewport) return;
    const savedPosition = sessionScrollPositionsRef.current[activeSessionId];
    if (typeof savedPosition !== "number") return;

    const frame = window.requestAnimationFrame(() => {
      viewport.scrollTop = savedPosition;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeSessionId]);

  const saveActiveSessionScrollPosition = () => {
    const viewport = outputViewportRef.current;
    if (!viewport) return;
    sessionScrollPositionsRef.current[activeSessionId] = viewport.scrollTop;
  };

  const handleSessionTabSelect = (sessionId: string) => {
    if (sessionId === activeSessionId) return;
    saveActiveSessionScrollPosition();
    setActiveSession(sessionId);
  };

  const handleCreateSession = () => {
    saveActiveSessionScrollPosition();
    createSession();
  };

  const handleCloseSession = (sessionId: string) => {
    if (sessionId === activeSessionId) saveActiveSessionScrollPosition();
    delete sessionScrollPositionsRef.current[sessionId];
    closeSession(sessionId);
  };

  const handleOutputScroll = () => {
    const viewport = outputViewportRef.current;
    if (!viewport) return;
    sessionScrollPositionsRef.current[activeSessionId] = viewport.scrollTop;
  };

  const startRenameTab = (tabId: string, tabName: string) => {
    setEditingTabId(tabId);
    setEditingTabName(tabName);
  };

  const commitRenameTab = (tabId: string) => {
    if (editingTabId !== tabId) return;
    renameSession(tabId, editingTabName);
    setEditingTabId(null);
    setEditingTabName("");
  };

  const cancelRenameTab = () => {
    setEditingTabId(null);
    setEditingTabName("");
  };

  return {
    outputViewportRef,
    editingTabId,
    editingTabName,
    setEditingTabName,
    handleOutputScroll,
    handleSessionTabSelect,
    handleCreateSession,
    handleCloseSession,
    startRenameTab,
    commitRenameTab,
    cancelRenameTab,
  };
}
