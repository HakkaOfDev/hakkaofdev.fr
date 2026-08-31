import { beforeEach, describe, expect, it } from "vitest";
import { useWindowStore } from "@/stores/window.store";

describe("window store", () => {
  beforeEach(() => {
    useWindowStore.setState({
      isMinimized: false,
      isMaximized: false,
      dockAnchor: null,
    });
  });

  it("starts with the window open and no dock anchor", () => {
    expect(useWindowStore.getState().isMinimized).toBe(false);
    expect(useWindowStore.getState().dockAnchor).toBeNull();
  });

  it("minimizes and restores", () => {
    useWindowStore.getState().minimize();
    expect(useWindowStore.getState().isMinimized).toBe(true);

    useWindowStore.getState().restore();
    expect(useWindowStore.getState().isMinimized).toBe(false);
  });

  it("stays minimized when minimize is called twice", () => {
    useWindowStore.getState().minimize();
    useWindowStore.getState().minimize();
    expect(useWindowStore.getState().isMinimized).toBe(true);
  });

  it("toggles both ways", () => {
    useWindowStore.getState().toggleMinimize();
    expect(useWindowStore.getState().isMinimized).toBe(true);

    useWindowStore.getState().toggleMinimize();
    expect(useWindowStore.getState().isMinimized).toBe(false);
  });

  it("drops maximized when the window collapses into the dock", () => {
    useWindowStore.getState().toggleMaximize();
    expect(useWindowStore.getState().isMaximized).toBe(true);

    useWindowStore.getState().toggleMinimize();
    expect(useWindowStore.getState().isMinimized).toBe(true);
    expect(useWindowStore.getState().isMaximized).toBe(false);
  });

  it("restores a plain window when maximizing from the dock", () => {
    useWindowStore.getState().minimize();

    useWindowStore.getState().toggleMaximize();
    expect(useWindowStore.getState().isMinimized).toBe(false);
    expect(useWindowStore.getState().isMaximized).toBe(true);
  });

  it("does not bring maximized back when restoring from the dock", () => {
    useWindowStore.getState().toggleMaximize();
    useWindowStore.getState().toggleMinimize();
    useWindowStore.getState().toggleMinimize();

    expect(useWindowStore.getState().isMinimized).toBe(false);
    expect(useWindowStore.getState().isMaximized).toBe(false);
  });

  it("is never both minimized and maximized", () => {
    const s = useWindowStore.getState;
    for (const step of [
      s().toggleMaximize,
      s().toggleMinimize,
      s().minimize,
      s().toggleMaximize,
      s().toggleMinimize,
    ]) {
      step();
      expect(s().isMinimized && s().isMaximized).toBe(false);
    }
  });

  it("records and clears the dock anchor", () => {
    useWindowStore.getState().setDockAnchor({ x: 120, y: 640 });
    expect(useWindowStore.getState().dockAnchor).toEqual({ x: 120, y: 640 });

    useWindowStore.getState().setDockAnchor(null);
    expect(useWindowStore.getState().dockAnchor).toBeNull();
  });
});
