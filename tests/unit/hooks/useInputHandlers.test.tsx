import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useInputHandlers } from "@/hooks/useInputHandlers";

function makeOptions(
  overrides: Partial<Parameters<typeof useInputHandlers>[0]> = {},
) {
  return {
    value: "",
    setValue: vi.fn(),
    addCommand: vi.fn(),
    navigateHistory: vi.fn(),
    resetHistory: vi.fn(),
    isOpen: false,
    activeIndex: 0,
    suggestionsCount: 0,
    openPopover: vi.fn(),
    closePopover: vi.fn(),
    moveActiveIndex: vi.fn(),
    applyTabCompletion: vi.fn(),
    applyActiveSuggestion: vi.fn(() => null),
    hasSuggestions: false,
    ...overrides,
  } as Parameters<typeof useInputHandlers>[0];
}

function fakeKeyEvent(key: string, extras: Partial<KeyboardEvent> = {}) {
  return {
    key,
    code: key,
    ctrlKey: false,
    metaKey: false,
    preventDefault: vi.fn(),
    ...extras,
  } as unknown as React.KeyboardEvent<HTMLInputElement>;
}

describe("useInputHandlers", () => {
  it("submit() runs addCommand and clears the input", () => {
    const opts = makeOptions({ value: "help" });
    const { result } = renderHook(() => useInputHandlers(opts));

    const e = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;
    act(() => result.current.handleSubmit(e));

    expect(e.preventDefault).toHaveBeenCalled();
    expect(opts.addCommand).toHaveBeenCalledWith("help");
    expect(opts.setValue).toHaveBeenCalledWith("");
    expect(opts.resetHistory).toHaveBeenCalled();
    expect(opts.closePopover).toHaveBeenCalled();
  });

  it("submit() ignores empty input", () => {
    const opts = makeOptions({ value: "" });
    const { result } = renderHook(() => useInputHandlers(opts));

    const e = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;
    act(() => result.current.handleSubmit(e));
    expect(opts.addCommand).not.toHaveBeenCalled();
  });

  it("Tab triggers applyTabCompletion", () => {
    const opts = makeOptions({ value: "the" });
    const { result } = renderHook(() => useInputHandlers(opts));
    const e = fakeKeyEvent("Tab");
    act(() => result.current.handleKeyDown(e));
    expect(e.preventDefault).toHaveBeenCalled();
    expect(opts.applyTabCompletion).toHaveBeenCalled();
  });

  it("Ctrl+P navigates back in history", () => {
    const opts = makeOptions();
    const { result } = renderHook(() => useInputHandlers(opts));
    const e = fakeKeyEvent("p", { ctrlKey: true });
    act(() => result.current.handleKeyDown(e));
    expect(opts.navigateHistory).toHaveBeenCalledWith(1);
  });

  it("Ctrl+N navigates forward in history", () => {
    const opts = makeOptions();
    const { result } = renderHook(() => useInputHandlers(opts));
    const e = fakeKeyEvent("n", { ctrlKey: true });
    act(() => result.current.handleKeyDown(e));
    expect(opts.navigateHistory).toHaveBeenCalledWith(-1);
  });

  it("ArrowUp moves active index when popover is open and not at top", () => {
    const opts = makeOptions({
      isOpen: true,
      activeIndex: 2,
      suggestionsCount: 5,
    });
    const { result } = renderHook(() => useInputHandlers(opts));
    const e = fakeKeyEvent("ArrowUp");
    act(() => result.current.handleKeyDown(e));
    expect(opts.moveActiveIndex).toHaveBeenCalledWith(-1);
    expect(opts.navigateHistory).not.toHaveBeenCalled();
  });

  it("ArrowUp falls through to history when popover is closed", () => {
    const opts = makeOptions({ isOpen: false });
    const { result } = renderHook(() => useInputHandlers(opts));
    const e = fakeKeyEvent("ArrowUp");
    act(() => result.current.handleKeyDown(e));
    expect(opts.navigateHistory).toHaveBeenCalledWith(1);
  });

  it("ArrowDown moves active index when below max", () => {
    const opts = makeOptions({
      isOpen: true,
      activeIndex: 0,
      suggestionsCount: 3,
    });
    const { result } = renderHook(() => useInputHandlers(opts));
    const e = fakeKeyEvent("ArrowDown");
    act(() => result.current.handleKeyDown(e));
    expect(opts.moveActiveIndex).toHaveBeenCalledWith(1);
  });

  it("Escape closes the popover when open", () => {
    const opts = makeOptions({ isOpen: true });
    const { result } = renderHook(() => useInputHandlers(opts));
    const e = fakeKeyEvent("Escape");
    act(() => result.current.handleKeyDown(e));
    expect(opts.closePopover).toHaveBeenCalled();
  });

  it("Escape is a no-op when popover is closed", () => {
    const opts = makeOptions({ isOpen: false });
    const { result } = renderHook(() => useInputHandlers(opts));
    const e = fakeKeyEvent("Escape");
    act(() => result.current.handleKeyDown(e));
    expect(opts.closePopover).not.toHaveBeenCalled();
  });

  it("Enter on closed popover submits current value", () => {
    const opts = makeOptions({ value: "help" });
    const { result } = renderHook(() => useInputHandlers(opts));
    const e = fakeKeyEvent("Enter");
    act(() => result.current.handleKeyDown(e));
    expect(opts.addCommand).toHaveBeenCalledWith("help");
  });

  it("Enter on open popover submits resolved suggestion", () => {
    const opts = makeOptions({
      value: "the",
      isOpen: true,
      applyActiveSuggestion: vi.fn(() => "theme list"),
    });
    const { result } = renderHook(() => useInputHandlers(opts));
    const e = fakeKeyEvent("Enter");
    act(() => result.current.handleKeyDown(e));
    expect(opts.applyActiveSuggestion).toHaveBeenCalled();
    expect(opts.addCommand).toHaveBeenCalledWith("theme list");
  });

  it("handleChange lowercases the input value and opens the popover", () => {
    const opts = makeOptions();
    const { result } = renderHook(() => useInputHandlers(opts));
    act(() =>
      result.current.handleChange({
        target: { value: "ThEme" },
      } as React.ChangeEvent<HTMLInputElement>),
    );
    expect(opts.setValue).toHaveBeenCalledWith("theme");
    expect(opts.openPopover).toHaveBeenCalled();
  });

  it("handleFocus opens the popover when there are suggestions", () => {
    const opts = makeOptions({ value: "th", hasSuggestions: true });
    const { result } = renderHook(() => useInputHandlers(opts));
    act(() => result.current.handleFocus());
    expect(opts.openPopover).toHaveBeenCalled();
  });

  it("handleFocus is a no-op when no suggestions", () => {
    const opts = makeOptions({ value: "th", hasSuggestions: false });
    const { result } = renderHook(() => useInputHandlers(opts));
    act(() => result.current.handleFocus());
    expect(opts.openPopover).not.toHaveBeenCalled();
  });
});
