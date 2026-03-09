"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTerminalResize } from "@/hooks/useTerminalResize";
import { useTerminalTabs } from "@/hooks/useTerminalTabs";
import { cn } from "@/lib/utils";
import { useCommands } from "../providers/CommandsProvider";
import { useTerminal } from "../providers/TerminalProvider";
import { TerminalBody } from "./TerminalBody";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalResizeHandles } from "./TerminalResizeHandles";
import { TerminalSearchBar } from "./TerminalSearchBar";
import { TerminalTabs } from "./TerminalTabs";

const SpotifyPlayer = dynamic(() => import("@/components/SpotifyPlayer"), {
  ssr: false,
});

const TerminalSettingsDialog = dynamic(
  () =>
    import("./TerminalSettingsDialog").then((mod) => ({
      default: mod.TerminalSettingsDialog,
    })),
  { ssr: false },
);

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
}

export const Terminal = ({ children, className }: TerminalProps) => {
  const {
    sessionTabs,
    activeSessionId,
    setActiveSession,
    createSession,
    closeSession,
    renameSession,
    reset,
    canCreateSession,
  } = useCommands();
  const {
    isMinimized,
    isMaximized,
    fontScale,
    fontFamilyStack,
    isSearchOpen,
    outputQuery,
    setOutputQuery,
    closeSearch,
    terminalWidth,
    terminalHeight,
    setTerminalLayout,
  } = useTerminal();

  const terminalRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const tabs = useTerminalTabs({
    sessionTabs,
    activeSessionId,
    setActiveSession,
    createSession,
    closeSession,
    renameSession,
  });

  const resize = useTerminalResize({
    terminalRef,
    isMinimized,
    isMaximized,
    fontFamilyStack,
    fontScale,
    terminalWidth,
    terminalHeight,
    setTerminalLayout,
  });

  useEffect(() => {
    if (!isSearchOpen) return;
    searchInputRef.current?.focus();
    searchInputRef.current?.select();
  }, [isSearchOpen]);

  return (
    <div
      ref={terminalRef}
      className={cn(
        "terminal-shell terminal-shadow terminal-resize relative z-0 flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-background dark:border-overlay-medium",
        !isMaximized && terminalWidth === null && "max-w-2xl",
        !isMinimized &&
          !isMaximized &&
          terminalHeight === null &&
          "max-h-[calc(100dvh-120px)] md:max-h-[min(calc(100dvh-120px),450px)]",
        isMinimized && "max-h-11",
        className,
      )}
      style={resize.containerStyle}
    >
      <TerminalHeader
        onResetTerminal={reset}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <TerminalTabs
        sessionTabs={sessionTabs}
        activeSessionId={activeSessionId}
        canCreateSession={canCreateSession}
        editingTabId={tabs.editingTabId}
        editingTabName={tabs.editingTabName}
        setEditingTabName={tabs.setEditingTabName}
        onSelectTab={tabs.handleSessionTabSelect}
        onCreateTab={tabs.handleCreateSession}
        onCloseTab={tabs.handleCloseSession}
        onStartRename={tabs.startRenameTab}
        onCommitRename={tabs.commitRenameTab}
        onCancelRename={tabs.cancelRenameTab}
      />

      {isSearchOpen ? (
        <TerminalSearchBar
          inputRef={searchInputRef}
          outputQuery={outputQuery}
          setOutputQuery={setOutputQuery}
          closeSearch={closeSearch}
        />
      ) : null}

      <TerminalBody
        isMinimized={isMinimized}
        outputViewportRef={tabs.outputViewportRef}
        onOutputScroll={tabs.handleOutputScroll}
        spotifySlot={<SpotifyPlayer />}
      >
        {children}
      </TerminalBody>

      <TerminalResizeHandles
        isLayoutInteractive={resize.isLayoutInteractive}
        isDesktopViewport={resize.isDesktopViewport}
        isMinimized={isMinimized}
        resizeHandles={resize.resizeHandles}
        onResizeStart={resize.handleResizeStart}
      />

      <TerminalSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
};
