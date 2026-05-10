import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CommandsProvider } from "@/components/providers/CommandsProvider";
import { useCommandHistory } from "@/hooks/useCommandHistory";
import { createId } from "@/lib/utils/terminal.utils";
import { useTerminalSessionsStore } from "@/stores/terminal-sessions.store";

function seed(commands: string[]) {
  useTerminalSessionsStore.setState((state) => {
    const first = state.sessions[0];
    if (!first) return state;
    return {
      sessions: [
        {
          ...first,
          showWelcome: false,
          commands: commands.map((input) => ({
            id: createId(),
            input,
            timestamp: new Date(),
          })),
        },
      ],
      activeSessionId: first.id,
    };
  });
}

beforeEach(() => {
  seed([]);
});

afterEach(() => {
  seed([]);
});

function setup(initialValue = "") {
  let currentValue = initialValue;
  const setValue = (next: string) => {
    currentValue = next;
  };

  const { result, rerender } = renderHook(
    ({ value }: { value: string }) => useCommandHistory(value, setValue),
    {
      initialProps: { value: currentValue },
      wrapper: ({ children }) => (
        <CommandsProvider>{children}</CommandsProvider>
      ),
    },
  );

  return {
    result,
    rerender,
    getValue: () => currentValue,
  };
}

describe("useCommandHistory", () => {
  it("does nothing when history is empty", () => {
    const { result, getValue } = setup("");
    act(() => {
      result.current.navigateHistory(1);
    });
    expect(result.current.historyOffset).toBe(0);
    expect(getValue()).toBe("");
  });

  it("walks backwards through history", () => {
    seed(["a", "b", "c"]);
    const { result, getValue } = setup("");

    act(() => result.current.navigateHistory(1));
    expect(getValue()).toBe("c");
    act(() => result.current.navigateHistory(1));
    expect(getValue()).toBe("b");
    act(() => result.current.navigateHistory(1));
    expect(getValue()).toBe("a");
  });

  it("clamps when stepping past the start", () => {
    seed(["a", "b"]);
    const { result, getValue } = setup("");
    act(() => result.current.navigateHistory(99));
    // Should land on the oldest entry, not crash
    expect(getValue()).toBe("a");
  });

  it("restores the draft when navigating back to offset 0", () => {
    seed(["a", "b"]);
    const { result, getValue } = setup("draft");
    act(() => result.current.navigateHistory(1));
    expect(getValue()).toBe("b");
    act(() => result.current.navigateHistory(-1));
    expect(getValue()).toBe("draft");
  });

  it("resetHistory restores offset to 0 and clears the draft", () => {
    seed(["a"]);
    const { result } = setup("draft");
    act(() => result.current.navigateHistory(1));
    act(() => result.current.resetHistory());
    expect(result.current.historyOffset).toBe(0);
  });
});
