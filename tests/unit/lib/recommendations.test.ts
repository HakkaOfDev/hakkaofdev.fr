import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { EXPERIENCES, RECOMMENDATIONS } from "@/lib/constants";

describe("recommendations", () => {
  const experienceSlugs = new Set(EXPERIENCES.map((e) => e.slug));

  it("binds every recommendation to a real experience", () => {
    for (const rec of RECOMMENDATIONS) {
      expect(experienceSlugs.has(rec.experienceSlug)).toBe(true);
    }
  });

  it("points at an existing PDF under public/recommendations", () => {
    for (const rec of RECOMMENDATIONS) {
      expect(rec.file).toMatch(/\.pdf$/);
      const path = join(process.cwd(), "public", "recommendations", rec.file);
      expect(existsSync(path), `missing ${path}`).toBe(true);
    }
  });

  it("has a recommender and a quote", () => {
    for (const rec of RECOMMENDATIONS) {
      expect(rec.recommender.name.trim()).toBeTruthy();
      expect(rec.recommender.role.trim()).toBeTruthy();
      expect(rec.recommender.company.trim()).toBeTruthy();
      expect(rec.quote.trim()).toBeTruthy();
    }
  });
});
