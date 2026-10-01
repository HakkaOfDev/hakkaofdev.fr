import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import CContact from "@/components/commands/renders/CContact";
import { PipelineProvider } from "@/components/providers/PipelineProvider";
import { SITE, SOCIALS } from "@/lib/constants";
import enMessages from "@/messages/en.json";

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => true,
}));

const contact = enMessages.Commands.contact;

function renderContact(grep?: string) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <PipelineProvider pipeline={grep ? { grep } : null}>
        <CContact />
      </PipelineProvider>
    </NextIntlClientProvider>,
  );
}

describe("CContact", () => {
  it("renders the email with a copy button, the location and every social", async () => {
    renderContact();
    expect(await screen.findByText(contact.intro)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: SITE.email })).toHaveAttribute(
      "href",
      `mailto:${SITE.email}`,
    );
    expect(
      screen.getByRole("button", { name: "Copy to clipboard" }),
    ).toBeInTheDocument();
    expect(screen.getByText(enMessages.Metadata.location)).toBeInTheDocument();
    for (const social of SOCIALS) {
      expect(
        screen.getByRole("link", { name: new RegExp(social.name) }),
      ).toHaveAttribute("href", social.url);
    }
  });

  it("keeps only the matching socials when grepping", async () => {
    renderContact("linkedin");
    expect(
      await screen.findByRole("link", { name: /LinkedIn/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /GitHub/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: SITE.email }),
    ).not.toBeInTheDocument();
  });

  it("reports when nothing matches the grep pattern", async () => {
    renderContact("zzz-nothing");
    expect(
      await screen.findByText('No matches for "zzz-nothing".'),
    ).toBeInTheDocument();
  });
});
