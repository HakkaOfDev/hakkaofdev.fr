import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import enMessages from "@/messages/en.json";
import frMessages from "@/messages/fr.json";

// A value distinct from the figure that used to be hardcoded, so these assert
// real interpolation of the {years} placeholder rather than a literal match.
const YEARS = 7;

describe("experience-years interpolation", () => {
  it("interpolates {years} into the English CV summary and SEO description", () => {
    const tCv = createTranslator({
      locale: "en",
      messages: enMessages,
      namespace: "CV",
    });
    const tMeta = createTranslator({
      locale: "en",
      messages: enMessages,
      namespace: "Metadata",
    });
    expect(tCv("summary", { years: YEARS })).toContain(
      "7+ years of experience",
    );
    expect(tMeta("description", { years: YEARS })).toContain(
      "7+ years of experience",
    );
  });

  it("interpolates {years} into the French CV summary and SEO description", () => {
    const messages = frMessages as typeof enMessages;
    const tCv = createTranslator({ locale: "fr", messages, namespace: "CV" });
    const tMeta = createTranslator({
      locale: "fr",
      messages,
      namespace: "Metadata",
    });
    // Also guards ICU parsing of the apostrophe in "d'expérience" next to {years}.
    expect(tCv("summary", { years: YEARS })).toContain(
      "plus de 7 ans d'expérience",
    );
    expect(tMeta("description", { years: YEARS })).toContain(
      "plus de 7 ans d'expérience",
    );
  });
});
