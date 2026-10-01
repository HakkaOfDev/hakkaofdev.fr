import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import CEducation from "@/components/commands/renders/CEducation";
import { PipelineProvider } from "@/components/providers/PipelineProvider";
import { EDUCATION } from "@/lib/constants";
import enMessages from "@/messages/en.json";

const prefersReducedMotion = vi.hoisted(() => vi.fn(() => true));

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: prefersReducedMotion,
}));

const educationMessages = enMessages.CV.education;
type EducationSlug = keyof typeof educationMessages;

function renderEducation(grep?: string) {
  return render(
    <NextIntlClientProvider locale="en" timeZone="UTC" messages={enMessages}>
      <PipelineProvider pipeline={grep ? { grep } : null}>
        <CEducation />
      </PipelineProvider>
    </NextIntlClientProvider>,
  );
}

describe("CEducation", () => {
  it("renders a timeline card per diploma with its dates and school", async () => {
    renderEducation();
    for (const education of EDUCATION) {
      const { name, location } =
        educationMessages[education.slug as EducationSlug];
      expect(await screen.findByText(name)).toBeInTheDocument();
      expect(screen.getAllByText(location).length).toBeGreaterThan(0);
      expect(
        screen.getByText(`${education.start} - ${education.end}`),
      ).toBeInTheDocument();
    }
  });

  it("types the cards in one after another", async () => {
    prefersReducedMotion.mockReturnValue(false);
    try {
      renderEducation();
      const first = educationMessages[EDUCATION[0].slug as EducationSlug];
      const last =
        educationMessages[
          EDUCATION[EDUCATION.length - 1].slug as EducationSlug
        ];

      expect(await screen.findByText(first.name)).toBeInTheDocument();
      expect(screen.queryByText(last.name)).not.toBeInTheDocument();
      expect(
        await screen.findByText(last.name, {}, { timeout: 4000 }),
      ).toBeInTheDocument();
    } finally {
      prefersReducedMotion.mockReturnValue(true);
    }
  });

  it("filters by grep and reports when nothing matches", async () => {
    const { unmount } = renderEducation("scientific");
    expect(
      await screen.findByText(educationMessages.lyceeBac.name),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(educationMessages.iutSecurity.name),
    ).not.toBeInTheDocument();
    unmount();

    renderEducation("zzz-nothing");
    expect(
      await screen.findByText('No matches for "zzz-nothing".'),
    ).toBeInTheDocument();
  });
});
