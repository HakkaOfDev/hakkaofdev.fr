import { describe, expect, it, vi } from "vitest";

vi.mock("@react-pdf/renderer", () => ({
  Document: ({ children }: { children?: unknown }) => children,
  Page: ({ children }: { children?: unknown }) => children,
  View: ({ children }: { children?: unknown }) => children,
  Text: ({ children }: { children?: unknown }) => children,
  Link: ({ children }: { children?: unknown }) => children,
  StyleSheet: { create: <T,>(styles: T) => styles },
  Font: { register: vi.fn(), registerHyphenationCallback: vi.fn() },
}));

import {
  ExperienceSection,
  ProjectsSection,
  SkillsSection,
} from "@/components/cv-pdf/CVSections";

describe("customizable CV sections", () => {
  it("drops the experience section when empty", () => {
    expect(
      ExperienceSection({ title: "Experience", experiences: [] }),
    ).toBeNull();
  });

  it("drops the projects section when empty", () => {
    expect(ProjectsSection({ title: "Projects", projects: [] })).toBeNull();
  });

  it("drops the skills section when empty", () => {
    expect(SkillsSection({ title: "Skills", skills: [] })).toBeNull();
  });

  it("renders the experience section when it has content", () => {
    expect(
      ExperienceSection({
        title: "Experience",
        experiences: [
          {
            slug: "kabila",
            period: "2022 - now",
            title: "Engineer",
            company: "Kabila",
            location: "Remote",
            descriptions: ["Built things"],
          },
        ],
      }),
    ).not.toBeNull();
  });
});
