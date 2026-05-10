import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SuggestionList from "@/components/SuggestionList";
import { withIntl } from "../../test-utils";

const baseSuggestions = [
  { value: "about", slug: "about", group: "Profile" as const },
  { value: "skills", slug: "skills", group: "Profile" as const },
  { value: "spotify", slug: "spotify", group: "Spotify" as const },
];

describe("SuggestionList", () => {
  it("renders one option per suggestion", () => {
    render(
      withIntl(
        <SuggestionList
          suggestions={baseSuggestions}
          activeIndex={0}
          query=""
          onSelect={() => {}}
        />,
      ),
    );

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
  });

  it("marks the active suggestion via aria-selected", () => {
    render(
      withIntl(
        <SuggestionList
          suggestions={baseSuggestions}
          activeIndex={1}
          query=""
          onSelect={() => {}}
        />,
      ),
    );

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(options[2]).toHaveAttribute("aria-selected", "false");
  });

  it("renders the localized command description", () => {
    render(
      withIntl(
        <SuggestionList
          suggestions={baseSuggestions}
          activeIndex={0}
          query=""
          onSelect={() => {}}
        />,
      ),
    );
    expect(screen.getByText("Display profile")).toBeInTheDocument();
    expect(screen.getByText("Spotify integration")).toBeInTheDocument();
  });

  it("renders the alias description when provided", () => {
    render(
      withIntl(
        <SuggestionList
          suggestions={[
            {
              value: "hi",
              description: "→ about",
              group: "Terminal",
            },
          ]}
          activeIndex={0}
          query="hi"
          onSelect={() => {}}
        />,
      ),
    );
    expect(screen.getByText("→ about")).toBeInTheDocument();
  });

  it("calls onSelect with the clicked index", async () => {
    const onSelect = vi.fn();
    render(
      withIntl(
        <SuggestionList
          suggestions={baseSuggestions}
          activeIndex={0}
          query=""
          onSelect={onSelect}
        />,
      ),
    );

    await userEvent.click(screen.getAllByRole("option")[2]);
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it("exposes a listbox role on the container", () => {
    render(
      withIntl(
        <SuggestionList
          suggestions={baseSuggestions}
          activeIndex={0}
          query=""
          onSelect={() => {}}
        />,
      ),
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("renders the keyboard hint footer (navigate / complete / run)", () => {
    render(
      withIntl(
        <SuggestionList
          suggestions={baseSuggestions}
          activeIndex={0}
          query=""
          onSelect={() => {}}
        />,
      ),
    );
    expect(screen.getByText("Navigate")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
    expect(screen.getAllByText("Run").length).toBeGreaterThan(0);
  });
});
