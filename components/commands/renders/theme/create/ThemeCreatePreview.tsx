"use client";

import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { TrafficLightsPreview } from "@/components/TrafficLights";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ThemeColors } from "@/types/theme";
import { THEME_COLOR_KEYS } from "@/types/theme";

const WelcomeHero = dynamic(() => import("@/components/WelcomeHero"), {
  ssr: false,
});

interface ThemeCreatePreviewProps {
  isDark: boolean;
  colors: ThemeColors;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export function ThemeCreatePreview({
  isDark,
  colors,
  showPreview,
  onTogglePreview,
}: ThemeCreatePreviewProps) {
  return (
    <div className="border-border border-t pt-3">
      <PreviewToggleButton
        showPreview={showPreview}
        onToggle={onTogglePreview}
      />

      {showPreview && (
        <div
          className={cn("overflow-hidden rounded-xl border", isDark && "dark")}
          style={{
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <PreviewTerminalHeader colors={colors} />
          <PreviewTerminalBody colors={colors} />
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components ────────────────────────────────────────────────────────

interface PreviewToggleButtonProps {
  showPreview: boolean;
  onToggle: () => void;
}

function PreviewToggleButton({
  showPreview,
  onToggle,
}: PreviewToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mb-2 flex cursor-pointer items-center gap-2 font-semibold text-[10px] text-muted-foreground uppercase tracking-wide transition-colors hover:text-foreground"
    >
      Live Preview
      {showPreview ? (
        <ChevronUp className="h-3 w-3" />
      ) : (
        <ChevronDown className="h-3 w-3" />
      )}
    </button>
  );
}

interface PreviewTerminalHeaderProps {
  colors: ThemeColors;
}

function PreviewTerminalHeader({ colors }: PreviewTerminalHeaderProps) {
  return (
    <div
      className="flex h-11 shrink-0 select-none items-center border-b px-4"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.muted,
      }}
    >
      <div className="flex min-w-0 flex-1 basis-0 items-center">
        <TrafficLightsPreview />
      </div>

      <span
        className="shrink-0 font-medium text-[11px] tracking-wide"
        style={{ color: colors["muted-foreground"] }}
      >
        {SITE.handle} &mdash; zsh
      </span>

      <PreviewActionButtons colors={colors} />
    </div>
  );
}

interface PreviewActionButtonsProps {
  colors: ThemeColors;
}

function PreviewActionButtons({ colors }: PreviewActionButtonsProps) {
  return (
    <div className="flex min-w-0 flex-1 basis-0 items-center justify-end gap-1.5">
      <div
        className="flex size-7 min-w-7 items-center justify-center rounded-md transition-all duration-200 hover:brightness-95"
        style={{ backgroundColor: colors.muted }}
        title="Reset terminal"
      >
        <RotateCcw size={13} style={{ color: colors["muted-foreground"] }} />
      </div>
    </div>
  );
}

interface PreviewTerminalBodyProps {
  colors: ThemeColors;
}

function PreviewTerminalBody({ colors }: PreviewTerminalBodyProps) {
  return (
    <div
      className="px-4 pt-4 pb-4"
      style={{
        backgroundColor: colors.background,
        ...Object.fromEntries(
          THEME_COLOR_KEYS.map((key) => [`--${key}`, colors[key]]),
        ),
      }}
    >
      <WelcomeHero isPreview />
    </div>
  );
}
