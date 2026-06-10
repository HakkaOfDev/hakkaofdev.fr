# Plan — `recommendations` terminal command

Date: 2026-06-09 · Branch: `develop`

## Overview

Add a new top-level terminal command `recommendations` that surfaces real
recommendation letters (PDFs under `public/recommendations/`), each **bound to a
real experience** in `EXPERIENCES`. First (and currently only) letter:
`kabila.pdf` — a recommendation for Alexandre Gossard written by **Manu Cabrera,
CEO & Co-Founder of BRAVALTA & Kabila** — bound to the `kabila` experience
(Software Engineer @ Kabila, since July 2022).

It renders a **native testimonial card** (not an embedded PDF): a pull-quote, the
recommender's signature block, a bound-experience badge, and actions to **view
the original PDF** (new tab) and **download** it. The data model is a list so
more letters are just a data entry + a PDF drop.

**Non-goals:** no `/api/recommendations` route (static file is served directly),
no in-terminal PDF viewer/iframe, no editing of the existing `cv`/`experiences`
output beyond `man` cross-links, no new PDF generation.

## Decisions (delegated to me by the user)

- **Layout:** rich testimonial card + link to original PDF.
- **i18n:** all 22 locales for the few new labels; the verbatim quote stays in
  English as a citation; the recommender name/role/company are data (proper
  nouns), not localized.
- **Discovery:** welcome-screen `Work` shortcut + `man` cross-links.

## Data / model

`lib/constants/resume.constants.ts`:

```ts
export type RecommendationEntry = {
  /** Experience slug this recommendation is bound to (must exist in EXPERIENCES). */
  experienceSlug: string;
  /** PDF filename under public/recommendations/. */
  file: string;
  /** Recommender identity (proper nouns; not localized). */
  recommender: { name: string; role: string; company: string; url?: string };
  /** Verbatim pull-quote from the letter (kept in the letter's language). */
  quote: string;
};

export const RECOMMENDATIONS: ReadonlyArray<RecommendationEntry> = [
  {
    experienceSlug: "kabila",
    file: "kabila.pdf",
    recommender: {
      name: "Manu Cabrera",
      role: "CEO & Co-Founder",
      company: "BRAVALTA & Kabila",
      url: "https://bravalta.com",
    },
    quote:
      "I recommend Alex without reservation to any company facing significant software and software-architecture challenges. If you are looking for a young, highly capable engineer with great attitude, energy, a strong technical foundation, an ability to keep learning, and excellent teamwork, Alex will be a fundamental piece of your team.",
  },
];
```

Exported from `lib/constants/index.ts`. The render reads the bound experience's
`company` / role (`name`) / `period` from `CV.experiences.{slug}` so the badge
stays a single source of truth with the `experiences` command.

## UI / UX

`components/commands/renders/CRecommendations.tsx` (new), mirroring
`CExperiences`/`CCv`:

- `AnimatedSpan` wrapper, `gap-4`.
- grep support via `useGrep`/`useGrepRaw`; no-match uses the generic
  `Commands.noMatches` (already translated everywhere), like `CExperiences`.
- Per card: quote (Quote icon, italic), recommender block (`recommendedBy`
  eyebrow + name + role · company-link), bound-experience badge (Briefcase icon,
  company-link · role, period under it), actions (`readLetter` → open PDF in new
  tab, `download` → `<a download>`).
- Color tokens (`text-primary`/`secondary`, `bg-*/10`, `ring-*`), `cn`,
  `next/link` with `target="_blank" rel="noreferrer"`. RTL-safe (logical props).

## i18n

Statically typed against `messages/en.json` only. New keys:

- `Commands.descriptions.recommendations` — help/`man` description.
- `Commands.recommendations.recommendedBy`
- `Commands.recommendations.readLetter`
- `Commands.recommendations.download` — reuse each locale's existing
  `Commands.cv.downloadPdf` value for consistency.

Applied to all 22 locales (insert after the `cv` entries), then normalized with
`biome format`.

## Registration points

1. `components/commands/registries/commands.registry.ts` — `exact("recommendations", …)`.
2. `lib/command-descriptors.ts` — `{ command: "recommendations", slug: "recommendations", group: "Work" }` (auto-drives help, suggestions, autocomplete).
3. `lib/constants/man-pages.constants.ts` — new `recommendations` man page; add `recommendations` to `experiences.seeAlso` and `cv.seeAlso`.
4. `components/WelcomeHero.tsx` — `Shortcut` in the `Work` row.

## Security

- Static, same-origin PDF link — no user input, no injection surface.
- `rel="noreferrer"` on external links; recommender email NOT surfaced (kept out
  of the UI even though it appears in the public PDF) to avoid scraping.
- No secrets, no server code, no new dependencies.

## Conventions checklist (vs. repo)

- Bun · Biome · `cn()` · path alias `@/` · `next/link` · logical/RTL-safe classes
  · color tokens · `AnimatedSpan` · grep pipeline · default export render
  component — all honored.

## Testing

- `tests/unit/lib/recommendations.test.ts` (new): every `experienceSlug` exists
  in `EXPERIENCES` (the "bound to a real experience" invariant); `file` ends in
  `.pdf` **and** exists under `public/recommendations/`; recommender + quote
  present.
- `tests/unit/components/commands/commands.registry.test.ts`: resolves
  `recommendations` (exact, `needsInput: false`).
- `tests/unit/lib/command-descriptors.test.ts`: add `recommendations` to expected
  entry points.
- Verify: `bun run typecheck`, `bun run lint`, `bun run test`, `bun run build`.

## Files

Create: `CRecommendations.tsx`, `recommendations.test.ts`, this plan.
Modify: `resume.constants.ts`, `constants/index.ts`, `commands.registry.ts`,
`command-descriptors.ts`, `man-pages.constants.ts`, `WelcomeHero.tsx`, 22
`messages/*.json`, `commands.registry.test.ts`, `command-descriptors.test.ts`.

## Steps

1. Data + barrel export.
2. Render component.
3. Registry + descriptor + man pages + WelcomeHero.
4. i18n across 22 locales + `biome format`.
5. Tests.
6. typecheck + lint + test + build.
