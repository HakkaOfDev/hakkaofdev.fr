# Roadmap

> Living document tracking what's been shipped, what's in progress, and what's planned for **hakkaofdev.fr**.

---

## Completed

### Core Terminal Interface

- [x] Terminal UI with macOS-style traffic lights, scrollable output, and input prompt
- [x] Command routing with subcommand support (`guestbook read`, `spotify now`, `theme dark`, `lang set`, etc.)
- [x] Autocomplete suggestions with tab completion and longest common prefix
- [x] Command history navigation (arrow keys, Ctrl-P/N)
- [x] Did-you-mean suggestions on unknown commands (Levenshtein distance)
- [x] Global keyboard shortcuts — Ctrl/Cmd+L (clear), Ctrl/Cmd+R (reset), Ctrl/Cmd+F (search), Ctrl/Cmd+/- (font zoom)
- [x] 20 base commands across 6 groups: Work, Profile, Guestbook, Spotify, Theme, Terminal

### Terminal UX Enhancements

- [x] Resizable terminal window (drag from edges/corners on desktop viewport ≥768px)
- [x] Fullscreen/maximize toggle in traffic lights (green button)
- [x] Minimize/restore toggle in traffic lights (yellow button)
- [x] Font size controls — Ctrl/Cmd +/- to zoom in/out (80–160%), persisted in `localStorage`
- [x] Custom font family selection — System Mono, JetBrains Mono, Fira Code, Source Code Pro, Montserrat
- [x] Terminal tabs — multiple command sessions (up to 8 tabs) with create, close, rename
- [x] Search/filter in terminal output — Ctrl/Cmd+F to toggle search bar
- [x] Terminal scrollback limit configuration (25/50/75/100 lines) in settings
- [x] Terminal settings dialog — theme, font family, font size, scrollback, keyboard shortcuts, reset-all
- [x] Preferences persistence — font scale, font family, scrollback limit in `localStorage`

### Advanced Theming System

- [x] Extracted all tokens into centralized theme definitions (`types/theme.ts`)
- [x] Runtime theme engine that injects CSS custom properties from active palette
- [x] Built-in terminal themes: **Default (dark)**, **Daylight**, **Dracula**, **Nord**, **Solarized**, **Monokai**, **Gruvbox**, **Tokyo Night**, **GitHub Light**, **Catppuccin Latte**, **Rosé Pine Dawn**
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
- [x] Bot user-agent filter excluded from unique-visitor counts
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
- [x] Subsetted Noto fonts per locale for full Unicode coverage (CJK, Arabic, Cyrillic, etc.)
- [x] Interactive command panel inside the CV preview overlay

### Internationalization (i18n)

- [x] `next-intl` integration with locale-aware routing (`localePrefix: as-needed`)
- [x] 22 locales — English, French, Spanish, German, Portuguese, Italian, Chinese, Japanese, Russian, Ukrainian, Polish, Czech, Dutch, Romanian, Greek, Turkish, Korean, Hindi, Vietnamese, Indonesian, Arabic, Hebrew
- [x] Right-to-left (RTL) support for Arabic and Hebrew
- [x] Browser-locale detection with cookie persistence
- [x] Translated command outputs, welcome message, error messages, and meta tags
- [x] `lang` command suite — `lang`, `lang set <locale>`, `lang auto`
- [x] Language picker UI in the terminal header
- [x] Standardised typography across locales (em-dashes, ellipses, smart punctuation)

### Security

- [x] Content Security Policy with locked-down `default-src`, `frame-ancestors 'none'`, `object-src 'none'`
- [x] HSTS (2-year max-age, includeSubDomains, preload)
- [x] Hardened headers — `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Permissions-Policy`
- [x] Hardened JSON-LD script injection (no inline `dangerouslySetInnerHTML` of unescaped data)
- [x] `poweredByHeader: false` and production source maps for stack-trace debugging

### SEO & Metadata

- [x] Dynamic Open Graph image (1200x630, Satori), pre-rendered at build time
- [x] `sitemap.xml` and `robots.txt` generation
- [x] Person JSON-LD structured data
- [x] Full metadata: title, description, canonical, OpenGraph, Twitter cards, keywords
- [x] Locale-aware `alternate` hreflang links

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

### Command System Enhancements

- [x] `alias` command — visitors can define custom shortcuts (`alias hi=about`), persisted in `localStorage`, with `alias remove <name>` and `alias clear` sub-commands
- [x] `history` command — display the active session's command history with timestamps; supports `history | grep <pattern>`
- [x] `man <command>` — detailed man pages with NAME, SYNOPSIS, DESCRIPTION, EXAMPLES, SEE ALSO; clickable cross-references and tab autocomplete on the command argument
- [x] Pipe/chain support — `help | grep spotify`, `history | grep theme`, `man theme | grep set`, `alias | grep gh` all filter their text output

### Analytics Dashboard

- [x] Site-wide visitor tracking — proxy now records every routed path (locale-normalized) with country, user-agent, and referrer host
- [x] Schema: `referrer` column on `visitors`, `classify_browser` / `parse_referrer_host` SQL helpers, `top_pages` / `visitor_browsers` / `visitor_referrers` views
- [x] Time-bounded RPCs — `get_unique_visitors_site_range`, `get_top_pages_range`, `get_visitor_countries_range`, `get_visitor_browsers_range`, `get_visitor_referrers_range`, `get_visitor_trend` (zero-filled daily series)
- [x] `stats` command sub-commands — `stats countries`, `stats browsers`, `stats referrers`, `stats trend`
- [x] `--last` flag on every `stats` view — uniform short labels `24h`, `7d`, `30d`, `90d`, `all` (also accepts shorthand like `--7d`, `--month`, `--1m`)
- [x] Country breakdown with regional flag emojis and locale-aware country names (`Intl.DisplayNames`)
- [x] Browser breakdown with SQL-side classification (Chrome / Safari / Firefox / Edge / Opera / Other)
- [x] Daily visitor area chart with mini stats card (total / peak / average) — built on shadcn/ui charts (recharts)
- [x] Country bar chart, browser donut chart — same shadcn/ui chart primitives, theme-aware colors
- [x] Translated to all 22 locales — descriptions for the new sub-commands plus all UI strings

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

### Guestbook Improvements

- [ ] Admin moderation panel (approve/reject/delete entries)
- [ ] Emoji reactions on guestbook entries
- [ ] Pagination or infinite scroll for large entry lists
- [ ] Optional GitHub OAuth for signed entries
- [ ] Markdown support in guestbook messages

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

*Last updated: May 8, 2026*
