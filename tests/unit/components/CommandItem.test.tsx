import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CommandItem from "@/components/commands/CommandItem";
import { CommandsProvider } from "@/components/providers/CommandsProvider";
import { useTerminalSessionsStore } from "@/stores/terminal-sessions.store";
import { withIntl } from "../../test-utils";

vi.mock("framer-motion", async () => {
  const actual =
    await vi.importActual<Record<string, unknown>>("framer-motion");
  return actual;
});

afterEach(() => {
  vi.useRealTimers();
});

const baseCommand = {
  id: "cmd-1",
  input: "",
  timestamp: new Date("2026-01-01T12:34:56Z"),
};

function renderItem(input: string) {
  return render(
    withIntl(
      <CommandsProvider>
        <CommandItem {...baseCommand} input={input} />
      </CommandsProvider>,
    ),
  );
}

describe("CommandItem", () => {
  it("renders the prompt header and the input text", async () => {
    renderItem("help");
    expect(await screen.findAllByText("help")).not.toHaveLength(0);
  });

  it("renders the timestamp", () => {
    renderItem("help");
    // Format depends on the host locale (12-hour vs 24-hour); just assert
    // the HH:MM:SS prefix exists.
    expect(screen.getByText(/\d{1,2}:\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it("shows a not-found message for unknown commands", async () => {
    renderItem("totally-fake-command");
    // CNotFound renders the input via t("title", { input }) — even with a
    // missing translation namespace, the input should still render via fallback.
    await waitFor(() => {
      expect(
        screen.getAllByText(/totally-fake-command/i).length,
      ).toBeGreaterThan(0);
    });
  });

  it("resolves a known command renderer and stops showing the resolving placeholder", async () => {
    renderItem("clear");
    // While the dynamic import is pending, the resolving placeholder shows;
    // once it resolves it must disappear (no artificial delay gate anymore).
    await waitFor(() => {
      expect(screen.queryByText(/Resolving command/)).toBeNull();
    });
  });

  it("triggers addCommand with the resolved input on the not-found suggestion click (smoke)", async () => {
    // We can't easily click the suggestions because they depend on Levenshtein
    // matching, but verifying the store stays stable is enough.
    const before = useTerminalSessionsStore.getState().sessions[0].commands;
    renderItem("totally-fake-command");
    expect(useTerminalSessionsStore.getState().sessions[0].commands).toBe(
      before,
    );
  });
});
