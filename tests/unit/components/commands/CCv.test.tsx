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
    await user.click(screen.getByRole("button", { name: /^projects:/ }));
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

  it("collapses param sections by default, showing only the selected count", async () => {
    const user = userEvent.setup();
    renderCard();
    const trigger = screen.getByRole("button", { name: /^projects:/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent(/\d+ \/ \d+/);
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("collapses all params from the endpoint header but keeps the URL and actions", async () => {
    const user = userEvent.setup();
    renderCard();
    const header = screen.getByRole("button", { name: /\/api\/cv/ });
    expect(header).toHaveAttribute("aria-expanded", "true");
    await user.click(header);
    expect(header).toHaveAttribute("aria-expanded", "false");
    const content = document.getElementById(
      header.getAttribute("aria-controls") ?? "",
    );
    expect(content).toHaveAttribute("inert");
    for (const el of [
      screen.getByRole("link", { name: "Try it out" }),
      screen.getByRole("link", { name: "Download" }),
      screen.getByText("Request URL"),
    ]) {
      expect(content).not.toContainElement(el);
    }
  });

  it("toggles download via the switch", async () => {
    const user = userEvent.setup();
    renderCard();
    const sw = screen.getByRole("switch", { name: "download" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
    expect(previewHref()).toContain("download=");
    await user.click(screen.getByText("true"));
    expect(sw).toHaveAttribute("aria-checked", "false");
  });
});
