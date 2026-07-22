import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import CCv from "@/components/commands/renders/CCv";
import { PROJECTS } from "@/lib/constants/projects.constants";
import { EXPERIENCES } from "@/lib/constants/resume.constants";
import { SKILLS } from "@/lib/constants/skills.constants";

// Realistic messages built from the constants so labels render cleanly.
const messages = {
  Commands: {
    cv: {
      description: "My CV as a PDF",
      openPreview: "Try it out",
      downloadPdf: "Download",
      experiences: "experiences",
      projects: "projects",
      skills: "skills",
      selectAll: "all",
      selectNone: "none",
      reset: "reset",
    },
  },
  CV: {
    experiences: Object.fromEntries(
      EXPERIENCES.map((e) => [e.slug, { name: e.slug }]),
    ),
    projects: Object.fromEntries(
      PROJECTS.map((p) => [p.slug, { name: p.slug, description: "" }]),
    ),
    skillGroups: Object.fromEntries(SKILLS.map((s) => [s.slug, s.slug])),
  },
};

function renderCard() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <CCv />
    </NextIntlClientProvider>,
  );
}

function previewHref(): string {
  return (
    screen.getByRole("link", { name: "Try it out" }).getAttribute("href") ?? ""
  );
}

describe("CCv customizable command", () => {
  it("defaults to a clean preview URL", () => {
    renderCard();
    expect(previewHref()).toBe("/api/cv?lang=en");
  });

  it("narrows the URL when a project is removed", async () => {
    const user = userEvent.setup();
    renderCard();
    // "bravalta" is the first default project; toggle it off.
    await user.click(screen.getByRole("button", { name: "bravalta" }));
    const href = previewHref();
    expect(href).toContain("projects=");
    expect(href).not.toContain("bravalta");
    expect(href).toContain("kabilaApp");
  });

  it("emits an empty param (dropping the section) when a category is cleared", async () => {
    const user = userEvent.setup();
    renderCard();
    // The experiences category's "none" control clears all experience chips.
    const experiencesGroup = screen.getByRole("group", { name: "experiences" });
    await user.click(
      within(experiencesGroup).getByRole("button", { name: "none" }),
    );
    expect(previewHref()).toMatch(/[?&]experiences=(&|$)/);
  });
});
