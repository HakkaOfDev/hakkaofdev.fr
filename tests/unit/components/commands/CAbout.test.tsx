import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import CAbout from "@/components/commands/renders/CAbout";
import { PipelineProvider } from "@/components/providers/PipelineProvider";
import { SITE } from "@/lib/constants";
import enMessages from "@/messages/en.json";

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => true,
}));

function renderAbout(grep?: string) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <PipelineProvider pipeline={grep ? { grep } : null}>
        <CAbout />
      </PipelineProvider>
    </NextIntlClientProvider>,
  );
}

describe("CAbout", () => {
  it("renders the profile card with contact, languages and hobbies", async () => {
    renderAbout();
    expect(await screen.findByText(SITE.name)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(enMessages.CV.headline)),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: SITE.email })).toHaveAttribute(
      "href",
      `mailto:${SITE.email}`,
    );
    expect(screen.getByText("French · Native")).toBeInTheDocument();
    expect(screen.getByText("Motorcycles")).toBeInTheDocument();
  });

  it("keeps only the matching rows when grepping", async () => {
    renderAbout("tennis");
    expect(await screen.findByText("Tennis")).toBeInTheDocument();
    expect(screen.queryByText(SITE.name)).not.toBeInTheDocument();
    expect(screen.queryByText("French · Native")).not.toBeInTheDocument();
  });

  it("reports when nothing matches the grep pattern", async () => {
    renderAbout("zzz-nothing");
    expect(
      await screen.findByText('No matches for "zzz-nothing".'),
    ).toBeInTheDocument();
  });
});
