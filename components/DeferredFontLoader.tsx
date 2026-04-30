"use client";

import { useEffect } from "react";
import { useTerminalPreferencesStore } from "@/stores/terminal-preferences.store";

const TERMINAL_DEFERRED_FONT_IDS = ["fira", "source"] as const;

const FONT_CONFIG = {
  montserrat: {
    url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap",
    variable: "--font-montserrat",
    family:
      "'Montserrat', -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
  },
  fira: {
    url: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap",
    variable: "--font-fira-code",
    family: "'Fira Code', ui-monospace, monospace",
  },
  source: {
    url: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600&display=swap",
    variable: "--font-source-code-pro",
    family: "'Source Code Pro', ui-monospace, monospace",
  },
} as const;

function loadFont(id: keyof typeof FONT_CONFIG) {
  if (document.querySelector(`link[data-deferred-font="${id}"]`)) return;

  const config = FONT_CONFIG[id];

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = config.url;
  link.setAttribute("data-deferred-font", id);
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.setAttribute("data-deferred-font", id);
  style.textContent = `:root { ${config.variable}: ${config.family}; }`;
  document.head.appendChild(style);
}

export function DeferredFontLoader() {
  const fontFamily = useTerminalPreferencesStore((state) => state.fontFamily);

  useEffect(() => {
    loadFont("montserrat");
  }, []);

  useEffect(() => {
    if (
      typeof fontFamily !== "string" ||
      !TERMINAL_DEFERRED_FONT_IDS.includes(
        fontFamily as (typeof TERMINAL_DEFERRED_FONT_IDS)[number],
      )
    ) {
      return;
    }

    loadFont(fontFamily as "fira" | "source");
  }, [fontFamily]);

  return null;
}
