"use client";

import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { useTerminal } from "./TerminalProvider";

function TrafficLights() {
  const {
    isMinimized,
    isMaximized,
    handleClose,
    handleMinimize,
    handleMaximize,
  } = useTerminal();

  return (
    <div className="flex flex-row items-center group/dots -ml-1.5">
      {/* Close → Easter egg */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close terminal"
        className="relative flex items-center justify-center w-6 h-6 cursor-pointer group/btn"
      >
        <span className="traffic-light traffic-light-red h-[13px] w-[13px] rounded-full bg-[#FF5F57] flex items-center justify-center transition-[box-shadow] duration-200 group-hover/btn:brightness-110">
          <X
            size={10}
            strokeWidth={2.5}
            className="text-black/60 opacity-0 group-hover/dots:opacity-100 transition-opacity duration-150"
          />
        </span>
      </button>

      {/* Minimize → Collapse / restore terminal body */}
      <button
        type="button"
        onClick={handleMinimize}
        aria-label={isMinimized ? "Restore terminal" : "Minimize terminal"}
        className="relative flex items-center justify-center w-6 h-6 cursor-pointer group/btn"
      >
        <span className="traffic-light traffic-light-yellow h-[13px] w-[13px] rounded-full bg-[#FEBC2E] flex items-center justify-center transition-[box-shadow] duration-200 group-hover/btn:brightness-110">
          <Minus
            size={10}
            strokeWidth={2.5}
            className="text-black/60 opacity-0 group-hover/dots:opacity-100 transition-opacity duration-150"
          />
        </span>
      </button>

      {/* Fullscreen → Toggle expanded view */}
      <button
        type="button"
        onClick={handleMaximize}
        aria-label={isMaximized ? "Restore terminal size" : "Expand terminal"}
        className="relative flex items-center justify-center w-6 h-6 cursor-pointer group/btn"
      >
        <span className="traffic-light traffic-light-green h-[13px] w-[13px] rounded-full bg-[#28C840] flex items-center justify-center transition-[box-shadow] duration-200 group-hover/btn:brightness-110">
          {isMaximized ? (
            <Minimize2
              size={8}
              strokeWidth={2.5}
              className="text-black/60 opacity-0 group-hover/dots:opacity-100 transition-opacity duration-150"
            />
          ) : (
            <Maximize2
              size={7}
              strokeWidth={2.5}
              className="text-black/60 opacity-0 group-hover/dots:opacity-100 transition-opacity duration-150"
            />
          )}
        </span>
      </button>
    </div>
  );
}

export { TrafficLights };
