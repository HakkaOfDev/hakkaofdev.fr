import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";

function setup(
  overrides: Partial<Parameters<typeof useGlobalShortcuts>[0]> = {},
) {
  const opts = {
    clearCommands: vi.fn(),
    reset: vi.fn(),
    setValue: vi.fn(),
    resetHistory: vi.fn(),
    closePopover: vi.fn(),
    toggleSearch: vi.fn(),
    canSearch: true,
    increaseFontScale: vi.fn(),
    decreaseFontScale: vi.fn(),
    ...overrides,
  };
  const { unmount } = renderHook(() => useGlobalShortcuts(opts));
  return { opts, unmount };
}

function dispatch(init: KeyboardEventInit) {
  const event = new KeyboardEvent("keydown", { ...init, cancelable: true });
  window.dispatchEvent(event);
  return event;
}

describe("useGlobalShortcuts", () => {
  it("Ctrl+L clears commands and resets state", () => {
    const { opts, unmount } = setup();
    dispatch({ key: "l", ctrlKey: true });
    expect(opts.clearCommands).toHaveBeenCalled();
    expect(opts.setValue).toHaveBeenCalledWith("");
    expect(opts.resetHistory).toHaveBeenCalled();
    expect(opts.closePopover).toHaveBeenCalled();
    unmount();
  });

  it("Ctrl+R triggers reset", () => {
    const { opts, unmount } = setup();
    dispatch({ key: "r", ctrlKey: true });
    expect(opts.reset).toHaveBeenCalled();
    unmount();
  });

  it("Ctrl+F toggles search when canSearch", () => {
    const { opts, unmount } = setup({ canSearch: true });
    dispatch({ key: "f", ctrlKey: true });
    expect(opts.toggleSearch).toHaveBeenCalled();
    unmount();
  });

  it("Ctrl+F does nothing when canSearch=false", () => {
    const { opts, unmount } = setup({ canSearch: false });
    dispatch({ key: "f", ctrlKey: true });
    expect(opts.toggleSearch).not.toHaveBeenCalled();
    unmount();
  });

  it("Ctrl+= and Ctrl++ increase font scale", () => {
    const { opts, unmount } = setup();
    dispatch({ key: "=", ctrlKey: true });
    dispatch({ key: "+", ctrlKey: true });
    expect(opts.increaseFontScale).toHaveBeenCalledTimes(2);
    unmount();
  });

  it("Ctrl+- decreases font scale", () => {
    const { opts, unmount } = setup();
    dispatch({ key: "-", ctrlKey: true });
    expect(opts.decreaseFontScale).toHaveBeenCalled();
    unmount();
  });

  it("does nothing without Ctrl", () => {
    const { opts, unmount } = setup();
    dispatch({ key: "l" });
    dispatch({ key: "r" });
    dispatch({ key: "f" });
    expect(opts.clearCommands).not.toHaveBeenCalled();
    expect(opts.reset).not.toHaveBeenCalled();
    expect(opts.toggleSearch).not.toHaveBeenCalled();
    unmount();
  });

  it("does nothing when meta is also pressed", () => {
    const { opts, unmount } = setup();
    dispatch({ key: "l", ctrlKey: true, metaKey: true });
    expect(opts.clearCommands).not.toHaveBeenCalled();
    unmount();
  });

  it("removes its event listener on unmount", () => {
    const { opts, unmount } = setup();
    unmount();
    dispatch({ key: "l", ctrlKey: true });
    expect(opts.clearCommands).not.toHaveBeenCalled();
  });
});
