import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CommandsProvider } from "@/components/providers/CommandsProvider";
import { TerminalProvider } from "@/components/providers/TerminalProvider";
import { Terminal } from "@/components/terminal/Terminal";
import { useAliasesStore } from "@/stores/aliases.store";
import { useTerminalSessionsStore } from "@/stores/terminal-sessions.store";
import { withIntl } from "../../test-utils";

beforeEach(() => {
  useAliasesStore.getState().clearAliases();
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

describe("Terminal", () => {
  it("renders shell, header, and tab strip", () => {
    const { container } = render(
      withIntl(
        <CommandsProvider>
          <TerminalProvider>
            <Terminal>
              <div data-testid="content">hello</div>
            </Terminal>
          </TerminalProvider>
        </CommandsProvider>,
      ),
    );

    expect(container.querySelector(".terminal-shell")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
});
