"use client";

import { RotateCcw, Settings2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { TrafficLights } from "@/components/TrafficLights";
import { SITE } from "@/lib/constants";

const GitHubStarButton = dynamic(
  () =>
    import("@/components/GitHubStarButton").then((mod) => ({
      default: mod.GitHubStarButton,
    })),
  {
    ssr: false,
  },
);

interface TerminalHeaderProps {
  onResetTerminal: () => void;
  onOpenSettings: () => void;
}

const toolbarButtonClass =
  "flex size-7 min-w-7 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 hover:bg-muted/60 dark:hover:bg-overlay-medium";

function TerminalHeader({
  onResetTerminal,
  onOpenSettings,
}: TerminalHeaderProps) {
  const t = useTranslations("Terminal");
  return (
    <div
      dir="ltr"
      className="grid h-11 shrink-0 select-none grid-cols-3 items-center gap-2 border-border/50 border-b bg-muted/40 px-2.5 sm:px-4 dark:border-overlay-subtle dark:bg-overlay-subtle"
    >
      <div className="flex min-w-0 items-center">
        <TrafficLights />
      </div>

      <span className="block w-full min-w-0 truncate px-1 text-center font-medium text-muted-foreground/80 text-xs tracking-wide">
        <span className="sm:hidden">hakka - zsh</span>
        <span className="hidden sm:inline">{SITE.handle} &mdash; zsh</span>
      </span>

      <div className="flex min-w-0 items-center justify-end gap-1">
        <div className="hidden min-[430px]:block">
          <GitHubStarButton />
        </div>

        <button
          type="button"
          onClick={onResetTerminal}
          className={toolbarButtonClass}
          title={t("header.resetTitle")}
          aria-label={t("header.resetLabel")}
        >
          <RotateCcw size={13} className="text-muted-foreground" />
        </button>

        <button
          type="button"
          className={toolbarButtonClass}
          title={t("header.settingsTitle")}
          aria-label={t("header.settingsLabel")}
          onClick={onOpenSettings}
        >
          <Settings2 size={13} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export { TerminalHeader };
