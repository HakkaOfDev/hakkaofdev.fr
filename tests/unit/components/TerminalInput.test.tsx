import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CommandsProvider } from "@/components/providers/CommandsProvider";
import { TerminalProvider } from "@/components/providers/TerminalProvider";
import { TerminalInput } from "@/components/terminal/TerminalInput";
import { useAliasesStore } from "@/stores/aliases.store";
import { useTerminalSessionsStore } from "@/stores/terminal-sessions.store";
import { withIntl } from "../../test-utils";

function renderInput() {
  return render(
    withIntl(
      <CommandsProvider>
        <TerminalProvider>
          <TerminalInput />
        </TerminalProvider>
      </CommandsProvider>,
    ),
  );
}

beforeEach(() => {
  useAliasesStore.getState().clearAliases();
  // Reset sessions back to a clean single session so each test starts fresh.
  useTerminalSessionsStore.setState((state) => {
    const first = state.sessions[0];
    if (!first) return state;
    return {
      sessions: [{ ...first, commands: [], showWelcome: true }],
      activeSessionId: first.id,
    };
  });
});

afterEach(() => {
  useAliasesStore.getState().clearAliases();
});

describe("TerminalInput", () => {
  it("renders an input with the localized placeholder", () => {
    renderInput();
    expect(screen.getByPlaceholderText("Type a command…")).toBeInTheDocument();
  });

  it("opens the suggestion popover after typing", async () => {
    const user = userEvent.setup();
    renderInput();

    const input = screen.getByPlaceholderText("Type a command…");
    await user.type(input, "the");

    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();
    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    for (const opt of options) {
      expect(opt.textContent?.startsWith("the")).toBe(true);
    }
  });

  it("autocompletes on Tab when there is a single match", async () => {
    const user = userEvent.setup();
    renderInput();

    const input = screen.getByPlaceholderText(
      "Type a command…",
    ) as HTMLInputElement;

    await user.type(input, "abou");
    await user.keyboard("{Tab}");

    expect(input.value).toBe("about");
  });

  it("submits a command on Enter and clears the input", async () => {
    const user = userEvent.setup();
    renderInput();

    const input = screen.getByPlaceholderText(
      "Type a command…",
    ) as HTMLInputElement;
    await user.type(input, "help");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(input.value).toBe("");
    });

    const sessions = useTerminalSessionsStore.getState().sessions;
    const last = sessions[0].commands.at(-1);
    expect(last?.input).toBe("help");
  });

  it("closes the popover on Escape", async () => {
    const user = userEvent.setup();
    renderInput();

    const input = screen.getByPlaceholderText("Type a command…");
    await user.type(input, "the");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });
  });

  it("forces input to lowercase as the user types", async () => {
    const user = userEvent.setup();
    renderInput();

    const input = screen.getByPlaceholderText(
      "Type a command…",
    ) as HTMLInputElement;
    await user.type(input, "Help");
    expect(input.value).toBe("help");
  });

  it("hides submit button when input is empty", () => {
    renderInput();
    const button = screen.getByRole("button", { name: "Run" });
    expect(button).toBeDisabled();
  });
});
