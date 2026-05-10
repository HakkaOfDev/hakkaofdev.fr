import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useSuggestions } from "@/hooks/useSuggestions";
import { useAliasesStore } from "@/stores/aliases.store";

afterEach(() => {
  useAliasesStore.getState().clearAliases();
});

function setup(initialValue = "") {
  let currentValue = initialValue;
  const setValue = (next: string) => {
    currentValue = next;
  };

  const { result, rerender } = renderHook(
    ({ value }: { value: string }) => useSuggestions(value, setValue),
    { initialProps: { value: currentValue } },
  );

  return {
    result,
    rerender: () => rerender({ value: currentValue }),
    getValue: () => currentValue,
    setValue: (next: string) => {
      currentValue = next;
      rerender({ value: currentValue });
    },
  };
}

describe("useSuggestions", () => {
  it("starts closed and with no suggestions for empty input", () => {
    const { result } = setup("");
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isOpen).toBe(false);
  });

  it("filters suggestions based on the current value", () => {
    const { result } = setup("the");
    expect(result.current.suggestions.length).toBeGreaterThan(0);
    for (const s of result.current.suggestions) {
      expect(s.value.startsWith("the")).toBe(true);
    }
  });

  it("opens / closes the popover", () => {
    const { result } = setup("the");

    act(() => {
      result.current.openPopover();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closePopover();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("keeps active index within bounds when navigating", () => {
    const { result } = setup("the");
    act(() => {
      result.current.openPopover();
    });

    const max = result.current.suggestions.length - 1;

    act(() => {
      result.current.moveActiveIndex(100);
    });
    expect(result.current.safeActiveIndex).toBe(max);

    act(() => {
      result.current.moveActiveIndex(-100);
    });
    expect(result.current.safeActiveIndex).toBe(0);
  });

  it("applyTabCompletion adds a space for subcommand prefixes", () => {
    const helper = setup("spotify");
    act(() => {
      helper.result.current.applyTabCompletion();
    });
    expect(helper.getValue()).toBe("spotify ");
  });

  it("applyTabCompletion completes a single match", () => {
    const helper = setup("abou");
    act(() => {
      helper.result.current.applyTabCompletion();
    });
    expect(helper.getValue()).toBe("about");
  });

  it("applyActiveSuggestion writes the active suggestion and closes the popover", () => {
    const helper = setup("the");
    act(() => {
      helper.result.current.openPopover();
    });

    let returned: string | null = null;
    act(() => {
      returned = helper.result.current.applyActiveSuggestion();
    });
    expect(returned).toBeTruthy();
    expect(helper.result.current.isOpen).toBe(false);
    expect(helper.getValue()).toBe(returned);
  });

  it("includes user-defined aliases in the suggestion pool", () => {
    useAliasesStore.getState().setAlias("zzbye", "exit");
    const { result } = setup("zzb");
    expect(result.current.suggestions.some((s) => s.value === "zzbye")).toBe(
      true,
    );
  });
});
