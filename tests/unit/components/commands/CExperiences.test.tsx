import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import CExperiences from "@/components/commands/renders/CExperiences";
import { PipelineProvider } from "@/components/providers/PipelineProvider";
import { EXPERIENCES, PROJECTS, RECOMMENDATIONS } from "@/lib/constants";
import enMessages from "@/messages/en.json";

const prefersReducedMotion = vi.hoisted(() => vi.fn(() => true));

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: prefersReducedMotion,
}));

vi.mock("@/components/providers/TerminalProvider", () => ({
  useTerminal: () => ({ fontFamilyStack: "monospace", fontScale: 100 }),
}));

const kabila = enMessages.CV.experiences.kabila;
const kabilaProjects = PROJECTS.filter((p) => p.experienceSlug === "kabila");
const kabilaRecommendation = RECOMMENDATIONS.find(
  (r) => r.experienceSlug === "kabila",
);

function renderExperiences(grep?: string) {
  return render(
    <NextIntlClientProvider locale="en" timeZone="UTC" messages={enMessages}>
      <PipelineProvider pipeline={grep ? { grep } : null}>
        <CExperiences />
      </PipelineProvider>
    </NextIntlClientProvider>,
  );
}

function detailsButton(name: string) {
  return screen.findByRole("button", { name: `View details: ${name}` });
}

describe("CExperiences", () => {
  it("renders one card per experience", async () => {
    renderExperiences();
    for (const experience of EXPERIENCES) {
      const { name } =
        enMessages.CV.experiences[
          experience.slug as keyof typeof enMessages.CV.experiences
        ];
      expect(await detailsButton(name)).toBeInTheDocument();
    }
  });

  it("types the cards in one after another", async () => {
    prefersReducedMotion.mockReturnValue(false);
    try {
      renderExperiences();
      const last = EXPERIENCES[EXPERIENCES.length - 1];
      const { name } =
        enMessages.CV.experiences[
          last.slug as keyof typeof enMessages.CV.experiences
        ];
      const lastCard = { name: `View details: ${name}` };

      expect(await detailsButton(kabila.name)).toBeInTheDocument();
      expect(screen.queryByRole("button", lastCard)).not.toBeInTheDocument();
      expect(
        await screen.findByRole("button", lastCard, { timeout: 4000 }),
      ).toBeInTheDocument();
    } finally {
      prefersReducedMotion.mockReturnValue(true);
    }
  });

  it("opens a dialog with highlights and skills, projects and recommendations tabs", async () => {
    const user = userEvent.setup();
    renderExperiences();
    await user.click(await detailsButton(kabila.name));

    const dialog = await screen.findByRole("dialog", { name: kabila.name });
    expect(
      within(dialog).getByRole("heading", { name: "Highlights" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(kabila.descriptions[0]),
    ).toBeInTheDocument();

    const skillsTab = within(dialog).getByRole("tab", { name: /^Skills/ });
    expect(skillsTab).toHaveAttribute("aria-selected", "true");
    expect(within(dialog).getByRole("tabpanel")).toHaveTextContent(
      "TypeScript",
    );

    await user.click(within(dialog).getByRole("tab", { name: /^Projects/ }));
    const projectsPanel = within(dialog).getByRole("tabpanel");
    expect(kabilaProjects.length).toBeGreaterThan(0);
    for (const project of kabilaProjects) {
      const { name } =
        enMessages.CV.projects[
          project.slug as keyof typeof enMessages.CV.projects
        ];
      expect(within(projectsPanel).getByText(name)).toBeInTheDocument();
    }

    await user.click(
      within(dialog).getByRole("tab", { name: /^Recommendations/ }),
    );
    const recommendationsPanel = within(dialog).getByRole("tabpanel");
    expect(
      within(recommendationsPanel).getByText(
        kabilaRecommendation?.recommender.name ?? "",
      ),
    ).toBeInTheDocument();
    expect(
      within(recommendationsPanel).getByRole("link", {
        name: "Read the full letter",
      }),
    ).toHaveAttribute("href", `/recommendations/${kabilaRecommendation?.file}`);
  });

  it("moves between tabs with the arrow keys", async () => {
    const user = userEvent.setup();
    renderExperiences();
    await user.click(await detailsButton(kabila.name));

    const dialog = await screen.findByRole("dialog", { name: kabila.name });
    await user.click(within(dialog).getByRole("tab", { name: /^Skills/ }));
    await user.keyboard("{ArrowRight}");
    const projectsTab = within(dialog).getByRole("tab", { name: /^Projects/ });
    expect(projectsTab).toHaveFocus();
    expect(projectsTab).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{End}");
    expect(
      within(dialog).getByRole("tab", { name: /^Recommendations/ }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("only shows tabs an experience has data for", async () => {
    const user = userEvent.setup();
    renderExperiences();
    const { name } = enMessages.CV.experiences.archeMC2;
    await user.click(await detailsButton(name));

    const dialog = await screen.findByRole("dialog", { name });
    expect(
      within(dialog)
        .getAllByRole("tab")
        .map((tab) => tab.textContent),
    ).toEqual([expect.stringMatching(/^Skills/)]);
  });

  it("filters cards by grep across skills and highlights", async () => {
    renderExperiences("hyper-v");
    expect(
      await detailsButton(
        enMessages.CV.experiences.efficienceInformatique.name,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: `View details: ${kabila.name}` }),
    ).not.toBeInTheDocument();
  });

  it("reports when nothing matches the grep pattern", async () => {
    renderExperiences("zzz-nothing");
    expect(
      await screen.findByText('No matches for "zzz-nothing".'),
    ).toBeInTheDocument();
  });
});
