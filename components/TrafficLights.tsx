"use client";

import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTerminal } from "./providers/TerminalProvider";

const TRAFFIC_LIGHT_COLORS = {
  red: "#FF5F57",
  yellow: "#FEBC2E",
  green: "#28C840",
} as const;

const ICON_CLASS =
  "text-black/60 opacity-0 transition-opacity duration-150 group-hover/dots:opacity-100";

// ─── Shared visual (used by both interactive and preview) ────────────────────

interface TrafficLightDotProps {
  color: keyof typeof TRAFFIC_LIGHT_COLORS;
  icon: React.ComponentType<{
    size: number;
    strokeWidth: number;
    className: string;
  }>;
  iconSize?: number;
}

function TrafficLightDot({
  color,
  icon: Icon,
  iconSize = 10,
}: TrafficLightDotProps) {
  return (
    <span
      className={`traffic-light traffic-light-${color} flex h-[13px] w-[13px] items-center justify-center rounded-full transition-[box-shadow] duration-200 group-hover/btn:brightness-110`}
      style={{ backgroundColor: TRAFFIC_LIGHT_COLORS[color] }}
    >
      <Icon
        size={color !== "green" ? iconSize - 1 : iconSize}
        strokeWidth={2.5}
        className={ICON_CLASS}
      />
    </span>
  );
}

// ─── Interactive (terminal header) ──────────────────────────────────────────

function TrafficLights() {
  const t = useTranslations("Terminal");
  const {
    isMinimized,
    isMaximized,
    handleClose,
    handleMinimize,
    handleMaximize,
  } = useTerminal();

  return (
    <div className="group/dots -ml-1.5 flex flex-row items-center">
      <button
        type="button"
        onClick={handleClose}
        aria-label={t("trafficLights.close")}
        className="group/btn relative flex h-6 w-6 cursor-pointer items-center justify-center"
      >
        <TrafficLightDot color="red" icon={X} />
      </button>

      <button
        type="button"
        onClick={handleMinimize}
        aria-label={
          isMinimized
            ? t("trafficLights.restoreMinimize")
            : t("trafficLights.minimize")
        }
        className="group/btn relative flex h-6 w-6 cursor-pointer items-center justify-center"
      >
        <TrafficLightDot color="yellow" icon={Minus} />
      </button>

      <button
        type="button"
        onClick={handleMaximize}
        aria-label={
          isMaximized
            ? t("trafficLights.restoreExpand")
            : t("trafficLights.expand")
        }
        className="group/btn relative flex h-6 w-6 cursor-pointer items-center justify-center"
      >
        <TrafficLightDot
          color="green"
          icon={isMaximized ? Minimize2 : Maximize2}
          iconSize={isMaximized ? 8 : 7}
        />
      </button>
    </div>
  );
}

// ─── Preview (decorative, no TerminalProvider required) ──────────────────────

function TrafficLightsPreview() {
  return (
    <div className="group/dots -ml-1.5 flex flex-row items-center">
      <div className="group/btn relative flex h-6 w-6 items-center justify-center">
        <TrafficLightDot color="red" icon={X} />
      </div>
      <div className="group/btn relative flex h-6 w-6 items-center justify-center">
        <TrafficLightDot color="yellow" icon={Minus} />
      </div>
      <div className="group/btn relative flex h-6 w-6 items-center justify-center">
        <TrafficLightDot color="green" icon={Maximize2} iconSize={7} />
      </div>
    </div>
  );
}

export { TrafficLights, TrafficLightsPreview };
