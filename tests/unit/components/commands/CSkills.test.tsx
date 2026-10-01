import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import CSkills from "@/components/commands/renders/CSkills";
import { PipelineProvider } from "@/components/providers/PipelineProvider";
import { SKILLS } from "@/lib/constants";
import enMessages from "@/messages/en.json";

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => true,
}));

const labels = enMessages.CV.skillGroups;

function renderSkills(grep?: string) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <PipelineProvider pipeline={grep ? { grep } : null}>
        <CSkills />
      </PipelineProvider>
    </NextIntlClientProvider>,
  );
}

describe("CSkills", () => {
  it("renders every skill group with its skills as chips", async () => {
    renderSkills();
    for (const group of SKILLS) {
      expect(
        await screen.findByText(labels[group.slug as keyof typeof labels]),
      ).toBeInTheDocument();
      for (const value of group.values) {
        expect(screen.getByText(value)).toBeInTheDocument();
      }
    }
  });

  it("keeps only the matching skills when grepping a skill", async () => {
    renderSkills("wagmi");
    expect(await screen.findByText("wagmi")).toBeInTheDocument();
    expect(screen.getByText(labels.blockchain)).toBeInTheDocument();
    expect(screen.queryByText("WalletConnect")).not.toBeInTheDocument();
    expect(screen.queryByText(labels.frameworks)).not.toBeInTheDocument();
  });

  it("keeps a whole group when grepping its label", async () => {
    renderSkills("testing");
    for (const value of ["Vitest", "Playwright", "Cypress", "Jest"]) {
      expect(await screen.findByText(value)).toBeInTheDocument();
    }
  });

  it("reports when nothing matches the grep pattern", async () => {
    renderSkills("zzz-nothing");
    expect(
      await screen.findByText('No matches for "zzz-nothing".'),
    ).toBeInTheDocument();
  });
});
