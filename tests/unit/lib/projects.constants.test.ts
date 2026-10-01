import { describe, expect, it } from "vitest";
import { EXPERIENCES, PROJECTS } from "@/lib/constants";

describe("projects", () => {
  const experienceSlugs = new Set(EXPERIENCES.map((e) => e.slug));

  it("binds every related project to a real experience", () => {
    for (const project of PROJECTS) {
      if (!project.experienceSlug) continue;
      expect(
        experienceSlugs.has(project.experienceSlug),
        `${project.slug} points at unknown experience ${project.experienceSlug}`,
      ).toBe(true);
    }
  });
});
