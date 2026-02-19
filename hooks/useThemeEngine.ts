"use client";

import { useContext } from "react";
import type { ThemeEngineContextValue } from "@/components/providers/ThemeProvider";
import { ThemeEngineContext } from "@/components/providers/ThemeProvider";

export function useThemeEngine(): ThemeEngineContextValue {
  const ctx = useContext(ThemeEngineContext);
  if (!ctx)
    throw new Error(
      "useThemeEngine must be used within a <ThemeEngineProvider>",
    );
  return ctx;
}
