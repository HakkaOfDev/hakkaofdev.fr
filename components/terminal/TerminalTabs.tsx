"use client";

import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { SessionTab } from "@/types/terminal";

interface TerminalTabsProps {
  sessionTabs: SessionTab[];
  activeSessionId: string;
  canCreateSession: boolean;
  editingTabId: string | null;
  editingTabName: string;
  setEditingTabName: (value: string) => void;
  onSelectTab: (tabId: string) => void;
  onCreateTab: () => void;
  onCloseTab: (tabId: string) => void;
  onStartRename: (tabId: string, tabName: string) => void;
  onCommitRename: (tabId: string) => void;
  onCancelRename: () => void;
}

function TerminalTabs({
  sessionTabs,
  activeSessionId,
  canCreateSession,
  editingTabId,
  editingTabName,
  setEditingTabName,
  onSelectTab,
  onCreateTab,
  onCloseTab,
  onStartRename,
  onCommitRename,
  onCancelRename,
}: TerminalTabsProps) {
  const t = useTranslations("Terminal");
  const renameInputRef = useRef<HTMLInputElement | null>(null);
  const shouldPreserveInputFocus = () =>
    typeof document !== "undefined" &&
    document.activeElement instanceof HTMLInputElement &&
    document.activeElement.classList.contains("terminal-input");

  useEffect(() => {
    if (!editingTabId) return;
    renameInputRef.current?.focus();
    renameInputRef.current?.select();
  }, [editingTabId]);

  return (
    <div
      dir="ltr"
      className="terminal-tabs-scrollbar flex items-center gap-1 overflow-x-auto border-border/40 border-b bg-muted/20 px-2 py-1 dark:border-overlay-subtle dark:bg-overlay-subtle/70"
    >
      {sessionTabs.map((tab) => {
        const isActive = tab.id === activeSessionId;
        const isEditing = editingTabId === tab.id;

        return (
          <div
            key={tab.id}
            className={cn(
              "group flex h-6 shrink-0 items-center rounded-sm border transition-colors",
              isActive
                ? "border-primary/40 bg-primary/10"
                : "border-border/50 bg-background/60 hover:bg-muted/40 dark:border-overlay-medium dark:bg-overlay-subtle dark:hover:bg-overlay-medium",
            )}
          >
            {isEditing ? (
              <input
                ref={renameInputRef}
                value={editingTabName}
                onChange={(event) => setEditingTabName(event.target.value)}
                onBlur={() => onCommitRename(tab.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onCommitRename(tab.id);
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    onCancelRename();
                  }
                }}
                className="h-6 w-24 bg-transparent px-2 py-1 font-mono text-xs outline-none"
                aria-label={t("tabs.rename", { name: tab.name })}
              />
            ) : (
              <button
                type="button"
                onMouseDown={(event) => {
                  if (shouldPreserveInputFocus()) event.preventDefault();
                }}
                onClick={() => onSelectTab(tab.id)}
                onDoubleClick={() => onStartRename(tab.id, tab.name)}
                className={cn(
                  "flex h-6 cursor-pointer items-center gap-1.5 rounded-l px-2 py-1 font-mono text-xs transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="max-w-24 truncate">{tab.name}</span>
                <span className="rounded bg-muted/60 px-1 py-px text-muted-foreground text-xs tabular-nums dark:bg-overlay-medium">
                  {tab.commandCount}
                </span>
              </button>
            )}

            {sessionTabs.length > 1 && !isEditing ? (
              <button
                type="button"
                onMouseDown={(event) => {
                  if (shouldPreserveInputFocus()) event.preventDefault();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="mr-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded text-muted-foreground/70 transition-colors hover:text-foreground"
                aria-label={t("tabs.close", { name: tab.name })}
                title={t("tabs.close", { name: tab.name })}
              >
                <X size={10} />
              </button>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        onMouseDown={(event) => {
          if (shouldPreserveInputFocus()) event.preventDefault();
        }}
        onClick={onCreateTab}
        disabled={!canCreateSession}
        className={cn(
          "inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors",
          canCreateSession
            ? "border-border/50 bg-background/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground dark:border-overlay-medium dark:bg-overlay-subtle dark:hover:bg-overlay-medium"
            : "cursor-not-allowed border-border/40 bg-muted/20 text-muted-foreground/50 dark:border-overlay-subtle dark:bg-overlay-subtle/40",
        )}
        aria-label={t("tabs.create")}
        title={canCreateSession ? t("tabs.create") : t("tabs.limitReached")}
      >
        <Plus size={11} />
      </button>
    </div>
  );
}

export { TerminalTabs };
