"use client";

import { create } from "zustand";

export type DockAnchor = { x: number; y: number };

type WindowStore = {
  isMinimized: boolean;
  isMaximized: boolean;
  dockAnchor: DockAnchor | null;
  minimize: () => void;
  restore: () => void;
  toggleMinimize: () => void;
  toggleMaximize: () => void;
  setDockAnchor: (anchor: DockAnchor | null) => void;
};

export const useWindowStore = create<WindowStore>()((set) => ({
  isMinimized: false,
  isMaximized: false,
  dockAnchor: null,
  minimize: () => set({ isMinimized: true, isMaximized: false }),
  restore: () => set({ isMinimized: false }),
  toggleMinimize: () =>
    set((state) => ({
      isMinimized: !state.isMinimized,
      isMaximized: state.isMinimized && state.isMaximized,
    })),
  toggleMaximize: () =>
    set((state) => ({
      isMaximized: !state.isMaximized,
      isMinimized: false,
    })),
  setDockAnchor: (dockAnchor) => set({ dockAnchor }),
}));
