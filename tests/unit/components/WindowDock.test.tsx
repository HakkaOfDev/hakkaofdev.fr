import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { DockItem } from "@/components/DockItem";
import { CommandsProvider } from "@/components/providers/CommandsProvider";
import { TerminalProvider } from "@/components/providers/TerminalProvider";
import { TrafficLights } from "@/components/TrafficLights";
import { WindowStage } from "@/components/WindowStage";
import { useWindowStore } from "@/stores/window.store";
import { withIntl } from "../../test-utils";

/** The layout in miniature: the window in one subtree, the dock in another. */
function renderWindowAndDock() {
  return render(
    withIntl(
      <CommandsProvider>
        <TerminalProvider>
          <WindowStage>
            <TrafficLights />
            <p>window content</p>
          </WindowStage>
        </TerminalProvider>
        <DockItem />
      </CommandsProvider>,
    ),
  );
}

describe("minimize to dock", () => {
  beforeEach(() => {
    useWindowStore.setState({ isMinimized: false, dockAnchor: null });
  });

  it("shows no dock tile while the window is open", () => {
    renderWindowAndDock();

    expect(
      screen.queryByRole("button", { name: "Restore terminal" }),
    ).not.toBeInTheDocument();
  });

  it("hides the window and reveals the dock tile on minimize", async () => {
    const user = userEvent.setup();
    renderWindowAndDock();

    await user.click(screen.getByRole("button", { name: "Minimize terminal" }));

    expect(useWindowStore.getState().isMinimized).toBe(true);
    expect(screen.getByText("window content").closest("main")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(
      await screen.findByRole("button", { name: "Restore terminal" }),
    ).toBeInTheDocument();
  });

  it("brings the window back when the dock tile is clicked", async () => {
    const user = userEvent.setup();
    renderWindowAndDock();

    await user.click(screen.getByRole("button", { name: "Minimize terminal" }));
    await user.click(
      await screen.findByRole("button", { name: "Restore terminal" }),
    );

    expect(useWindowStore.getState().isMinimized).toBe(false);
    expect(
      screen.getByText("window content").closest("main"),
    ).not.toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the window subtree mounted while minimized", async () => {
    const user = userEvent.setup();
    renderWindowAndDock();

    await user.click(screen.getByRole("button", { name: "Minimize terminal" }));

    expect(screen.getByText("window content")).toBeInTheDocument();
  });
});
