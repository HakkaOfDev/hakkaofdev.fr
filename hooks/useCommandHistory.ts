import { useCallback, useMemo, useRef, useState } from "react";
import { useCommands } from "@/components/providers/CommandsProvider";

/**
 * Manages browsing through previously executed commands with ↑/↓ or Ctrl-P/N.
 *
 * - Keeps a draft of the current input so it can be restored when the user
 *   leaves history mode (offset goes back to 0).
 * - Exposes `navigateHistory(delta)` instead of raw offset manipulation.
 */
export function useCommandHistory(
  value: string,
  setValue: (v: string) => void,
) {
  const { commands } = useCommands();
  const [historyOffset, setHistoryOffset] = useState(0);
  const draftRef = useRef("");

  const history = useMemo(() => commands.map((c) => c.input), [commands]);

  const navigateHistory = useCallback(
    (delta: number) => {
      if (history.length === 0) return;

      const nextOffset = historyOffset + delta;
      const clamped = Math.max(0, Math.min(nextOffset, history.length));

      // Avoid clearing the input when the user isn't browsing history.
      if (historyOffset === 0 && clamped === 0) return;

      // Save the current input as draft when entering history mode.
      if (historyOffset === 0 && clamped > 0) draftRef.current = value;
      setHistoryOffset(clamped);

      if (clamped === 0) {
        setValue(draftRef.current);
        return;
      }

      setValue(history[history.length - clamped]);
    },
    [history, historyOffset, value, setValue],
  );

  const resetHistory = useCallback(() => {
    setHistoryOffset(0);
    draftRef.current = "";
  }, []);

  return { historyOffset, navigateHistory, resetHistory } as const;
}
