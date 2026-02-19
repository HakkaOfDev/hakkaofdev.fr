# Roadmap

> Living document tracking what's been shipped, what's in progress, and what's planned for **hakkaofdev.fr**.

---

## Completed

### Core Terminal Interface

- [x] Terminal UI with macOS-style traffic lights, scrollable output, and input prompt
- [x] Command routing with subcommand support (`guestbook read`, `spotify now`, `theme dark`, etc.)
- [x] Autocomplete suggestions with tab completion and longest common prefix
- [x] Command history navigation (arrow keys, Ctrl-P/N)
- [x] Did-you-mean suggestions on unknown commands (Levenshtein distance)
- [x] Global keyboard shortcuts — Ctrl/Cmd+L (clear), Ctrl/Cmd+R (reset)
- [x] 16 base commands across 6 groups: Work, Profile, Guestbook, Spotify, Theme, Terminal

### Theming (Dark / Light)

- [x] `next-themes` provider with `class` attribute strategy and dark default
- [x] Light and dark palettes using OKLCH tokens in `globals.css`
- [x] Semantic CSS custom properties (`--background`, `--foreground`, `--primary`, `--muted`, `--accent`, etc.)
- [x] `theme dark`, `theme light`, `theme system` commands
- [x] Header toggle button with accessible label

### Advanced Theming System

- [x] Extracted all tokens into centralized theme definitions (`types/theme.ts`)
- [x] Runtime theme engine that injects CSS custom properties from active palette
- [x] Built-in terminal themes: **Dracula**, **Nord**, **Solarized Dark/Light**, **Monokai**, **Gruvbox Dark/Light**, **Tokyo Night**, **GitHub Dark/Light**, **Catppuccin Mocha/Latte**, **One Dark**, **Material**, **Synthwave '84**
- [x] Extended `theme` command suite:
  - `theme` — Show current theme info and quick actions
  - `theme list` — Browse all available themes with color previews
  - `theme set <name>` — Apply a theme instantly
  - `theme preview <name>` — Preview theme with 10-second auto-revert
  - `theme create` — Interactive theme creator with visual and JSON modes
  - `theme validate` — WCAG AA contrast audit for current theme
  - `theme cycle` — Rotate through themes with header button
- [x] Theme persistence in `localStorage` with SSR-safe hydration
- [x] Custom theme support via interactive creator with:
  - Visual editor with color pickers for all 15 semantic tokens
  - JSON editor for advanced users supporting OKLCH, hex, RGB, HSL
  - Live preview with exact terminal replica (non-functional shortcuts)
  - Copy theme JSON for sharing
  - Reset to default colors button
  - Real-time theme application on creation
- [x] WCAG AA contrast validation:
  - Automated contrast ratio checks on all text/background pairs
  - Pass/fail indicators with specific ratio requirements
  - Support for OKLCH, hex, RGB, and HSL color formats
  - Detailed validation reports with actionable feedback
- [x] Theme storage system:
  - Custom themes saved to `localStorage` and persisted across sessions
  - Theme registry with built-in and custom theme management
  - Conflict resolution between built-in and custom theme names

### Guestbook

- [x] REST API — `GET /api/guestbook` (list, sort, country filter) and `POST /api/guestbook` (create)
- [x] Country list endpoint — `GET /api/guestbook/countries`
- [x] Server-side validation (name 2–60 chars, message 2–800 chars, URL format)
- [x] Honeypot field (`company`) for bot mitigation
- [x] Per-IP rate limiting with configurable hourly cap
- [x] Optional auto-approval via `GUESTBOOK_AUTO_APPROVE`
- [x] IP hashing with salt for privacy
- [x] Read UI with sort toggle, country filter popover, refresh, and loading skeleton
- [x] Sign form with name, message, optional website

### Analytics

- [x] Page view tracking via `record_visit` Supabase RPC
- [x] Unique visitors (total, last 30 days, today) via materialized view
- [x] Top 20 visitor countries
- [x] `stats` command displaying coding time, top language, GitHub stars, contributions, and visitors

### Spotify

- [x] OAuth refresh-token flow with `getNowPlaying`, `getTopTracks`, `getRecentlyPlayed`
- [x] Server actions wrapping Spotify API calls
- [x] `spotify now`, `spotify top`, `spotify history` commands
- [x] Header "Now Playing" widget (dynamically imported)

### CV

- [x] PDF generation with `@react-pdf/renderer`
- [x] Inline preview and `?download=1` attachment mode
- [x] 1-hour cache headers

### SEO & Metadata

- [x] Dynamic Open Graph image (1200x630, Satori)
- [x] `sitemap.xml` and `robots.txt` generation
- [x] Person JSON-LD structured data
- [x] Full metadata: title, description, canonical, OpenGraph, Twitter cards, keywords

### CI/CD

- [x] PR checks: commitlint (conventional commits), Biome lint, TypeScript typecheck, Next.js build
- [x] Production dependency audit (weekly + per-PR)
- [x] Release Please for automated versioning on push to `main`

### Code Quality

- [x] Biome linter and formatter (recommended rules, import organization, React/Next.js rules)
- [x] Strict TypeScript (`strict: true`, `isolatedModules`)
- [x] Husky for pre-commit hooks

### Performance (partial)

- [x] Dynamic imports for `SpotifyPlayer` and `CommandItem`
- [x] TanStack Query with tuned `staleTime` per resource
- [x] `next: { revalidate }` caching on GitHub and WakaTime fetches
- [x] Guestbook per-IP rate limiting

### Accessibility (partial)

- [x] ARIA labels on all interactive elements (toggle, buttons, links, filter)
- [x] `role="listbox"` / `role="option"` with `aria-selected` on suggestion list
- [x] `aria-hidden` on decorative elements
- [x] Full keyboard navigation for suggestions, history, and shortcuts

### Documentation (partial)

- [x] README with features, tech stack, setup, env vars, commands, deployment guide
- [x] JSDoc on all hooks and service functions

### Database

- [x] Supabase schema for `guestbook_entries` with indexes and RLS policies
- [x] Supabase schema for `page_views`, `visitors`, views, and `record_visit()` RPC

---

## Planned

### Testing

There is currently no testing infrastructure. This is the highest-priority gap.

- [ ] Set up **Vitest** as the unit/integration test runner
- [ ] Add unit tests for pure logic: `lib/utils.ts`, `lib/services/*`, command parsing/routing
- [ ] Add component tests with **React Testing Library** for `Terminal`, `TerminalInput`, `SuggestionList`, `CommandItem`
- [ ] Add hook tests for `useSuggestions`, `useCommandHistory`, `useInputHandlers`, `useGlobalShortcuts`
- [ ] Add API route tests for `/api/views`, `/api/guestbook`, `/api/guestbook/countries`, `/api/cv`
- [ ] Set up **Playwright** for E2E tests (typing commands, suggestions, theme switching, guestbook flow)
- [ ] Integrate test runs into CI as a required check on PRs
- [ ] Add coverage reporting with a minimum threshold

### Internationalization (i18n)

- [ ] Integrate `next-intl` or a lightweight i18n solution
- [ ] Translate command outputs, welcome message, error messages, and meta tags
- [ ] Add a `lang` command to switch locale from the terminal
- [ ] Detect browser locale for a sensible default

### Command System Enhancements

- [ ] `alias` command — let visitors define custom shortcuts (e.g. `alias hi=about`)
- [ ] `history` command — display session command history with timestamps
- [ ] `man <command>` — show detailed help/usage for a specific command
- [ ] Pipe/chain support (`help | grep spotify`) for a more authentic shell feel
- [ ] `fortune` / `motd` — display a random dev quote or tip on session start

### Terminal UX Improvements

- [ ] Resizable terminal window (drag from edges/corners)
- [ ] Fullscreen/maximize toggle button in terminal header
- [ ] Split terminal view — multiple terminal instances side by side
- [ ] Font size controls (`Ctrl/Cmd +/-` to zoom in/out)
- [ ] Custom font family selection (Fira Code, JetBrains Mono, Source Code Pro, etc.)
- [ ] Terminal tabs — run multiple command sessions in different tabs
- [ ] Output copying with text selection support
- [ ] Search/filter in terminal output (`Ctrl/Cmd+F`)
- [ ] Terminal scrollback limit configuration
- [ ] Restore terminal position and size from `localStorage`
- [ ] Mobile-responsive terminal with touch gestures
- [ ] Terminal transparency/blur effect toggle

### Guestbook Improvements

- [ ] Admin moderation panel (approve/reject/delete entries)
- [ ] Emoji reactions on guestbook entries
- [ ] Pagination or infinite scroll for large entry lists
- [ ] Optional GitHub OAuth for signed entries
- [ ] Markdown support in guestbook messages

### Analytics Dashboard

- [ ] Richer `stats` output: top pages, referrers, browser breakdown
- [ ] Time-range filtering (`stats --last 7d`, `stats --month`)
- [ ] Inline ASCII/sparkline charts in terminal output

### Spotify Enhancements

- [ ] `spotify recommend` — suggest tracks based on listening history
- [ ] Album art rendered as ASCII art
- [ ] Mini progress bar for the currently playing track

### CI/CD Improvements

- [ ] Lighthouse CI checks (performance, accessibility, SEO scores)
- [ ] Automated dependency update PRs via **Renovate** or **Dependabot**
- [ ] **CodeQL** or **Semgrep** security scanning in CI
- [ ] Preview deployment comments on PRs

### Accessibility

- [ ] Support `prefers-reduced-motion` across all animations
- [ ] Add ARIA live regions for dynamic terminal output (screen reader announcements)
- [ ] Run **axe-core** automated checks in CI

### Performance & Infrastructure

- [ ] ISR or caching strategies for API routes to reduce Supabase load
- [ ] Edge rate limiting middleware for all public API routes
- [ ] Lazy-load heavy command renders (CV PDF, Spotify) only when invoked
- [ ] **OpenTelemetry** or structured logging for production observability
- [ ] Evaluate Server Components for command renders that don't need client interactivity
- [ ] Bundle analysis with `@next/bundle-analyzer` and size budgets

### Documentation

- [ ] `CONTRIBUTING.md` with architecture overview, command registration guide, and PR guidelines
- [ ] Document the command registration system so adding new commands is trivial
- [ ] Enable stricter TypeScript options (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)

---

*Last updated: February 2026*
