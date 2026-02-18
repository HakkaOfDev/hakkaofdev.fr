<div align="center">

# `> hakkaofdev.fr_`

### Interactive terminal-style portfolio

[![Live](https://img.shields.io/badge/%E2%96%B6%20Live-hakkaofdev.fr-22d3ee?style=for-the-badge&labelColor=141414)](https://hakkaofdev.fr)
[![Version](https://img.shields.io/badge/v1.1.1-E8B931?style=for-the-badge&logo=semver&logoColor=E8B931&labelColor=141414)](https://github.com/hakkaofdev/hakkaofdev.fr/releases)
[![CI](https://img.shields.io/github/actions/workflow/status/hakkaofdev/hakkaofdev.fr/ci.yml?style=for-the-badge&logo=github-actions&logoColor=22d3ee&label=CI&labelColor=141414)](https://github.com/hakkaofdev/hakkaofdev.fr/actions)
[![License](https://img.shields.io/badge/license-MIT-A855F7?style=for-the-badge&labelColor=141414)](LICENSE)

<br />

[![Next.js](https://img.shields.io/badge/Next.js%2016-141414?style=flat-square&logo=next.js&logoColor=fff)](https://nextjs.org)
[![React](https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=61DAFB&labelColor=141414)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=3178C6&labelColor=141414)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind%20v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=06B6D4&labelColor=141414)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=3FCF8E&labelColor=141414)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-141414?style=flat-square&logo=vercel&logoColor=fff)](https://vercel.com)
[![Biome](https://img.shields.io/badge/Biome-60A5FA?style=flat-square&logo=biome&logoColor=60A5FA&labelColor=141414)](https://biomejs.dev)
[![Spotify](https://img.shields.io/badge/Spotify%20API-1DB954?style=flat-square&logo=spotify&logoColor=1DB954&labelColor=141414)](https://developer.spotify.com)

<br />

<img src="public/preview.png" alt="hakkaofdev.fr preview" width="640" style="border-radius:8px;" />

</div>

<br />

## Overview

A terminal-inspired portfolio for **Alexandre Gossard** ([@hakkaofdev](https://github.com/hakkaofdev)) — Software Engineer & Digital Nomad.  
Type commands, explore projects, browse skills, sign the guestbook, and even check what's playing on Spotify.

<br />

## Highlights

| | Feature | Details |
|---|---|---|
| **`>`** | Terminal UI | Command input, history navigation, autocomplete, fuzzy did-you-mean |
| **`>`** | 18+ commands | `help` `projects` `skills` `experiences` `education` `about` `contact` `guestbook` `cv` `repo` `theme` `stats` `echo` `clear` `reset` `spotify` |
| **`>`** | Spotify integration | "Now Playing" header widget + `spotify now` / `spotify top` / `spotify history` |
| **`>`** | Guestbook | Public sign & read, honeypot + per-IP rate-limiting, moderation-ready |
| **`>`** | Dynamic CV | Server-rendered PDF via `@react-pdf/renderer` — preview or download |
| **`>`** | Theming | `theme dark` / `theme light` / `theme system` |
| **`>`** | SEO | Sitemap, robots.txt, JSON-LD, dynamic OG image |
| **`>`** | Analytics | Vercel Speed Insights + Supabase page-view tracking |

<br />

## Quick Start

> **Prerequisites** — Node.js 22+ &nbsp;·&nbsp; pnpm 9+

```bash
# clone & install
git clone https://github.com/hakkaofdev/hakkaofdev.fr.git
cd hakkaofdev.fr
pnpm install

# develop
pnpm dev          # → http://localhost:3000

# production
pnpm build && pnpm start
```

Copy `.env.example` to `.env.local` and fill in the values you need:

```bash
# Required
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Spotify (optional — enables widget + commands)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

# Supabase (optional — enables analytics + guestbook)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
APP_IP_SALT=
GUESTBOOK_AUTO_APPROVE=true
GUESTBOOK_RATE_LIMIT_MAX_PER_HOUR=3
```

<br />

## Commands Reference

| Command | Description |
|---|---|
| `help` | List all available commands |
| `projects` | Show projects grid |
| `skills` | Show categorized skills |
| `about` | Personal details, languages, hobbies |
| `education` | Education timeline |
| `experiences` | Experience timeline |
| `guestbook` | List & sign guestbook entries |
| `contact` | Contact methods & social profiles |
| `cv` | Open CV preview / download |
| `repo` | Repository details & clone command |
| `theme [dark\|light\|system]` | View or change the current theme |
| `stats` | Coding & GitHub activity stats |
| `echo <msg>` | Print custom text |
| `clear` | Clear terminal output |
| `reset` | Reset to the welcome screen |
| `spotify` | Spotify sub-command help |
| `spotify now` | Currently playing track |
| `spotify top` | Top tracks |
| `spotify history` | Recently played tracks |

<br />

## Project Structure

```
app/
├── api/            # Route handlers (cv, guestbook, spotify, views)
├── layout.tsx      # Root layout, providers, fonts
├── page.tsx        # Home (terminal shell)
├── sitemap.ts      # Dynamic sitemap
└── robots.ts       # Robots config

components/
├── commands/       # Command descriptors, registries, renderers
├── cv-pdf/         # React-PDF sections for CV generation
├── ui/             # Reusable UI primitives
├── Terminal.tsx     # Main terminal component
└── WelcomeHero.tsx # Initial greeting block

lib/
├── constants/      # Site, resume, skills, terminal, guestbook config
├── cv/             # CV data mapping & PDF styles
├── schemas/        # Zod validation schemas
├── services/       # Analytics, guestbook, Supabase clients
└── utils.ts        # Shared helpers

supabase/
└── schema/         # SQL migrations (guestbook table, RLS policies)
```

<br />

## Customization

**Content** lives in `lib/constants/` — edit the files there to change projects, skills, education, experiences, and social links.

**Adding a command:**

1. Add it to `COMMANDS` in `components/commands/command-descriptors.ts`
2. Create a renderer in `components/commands/renders/`
3. Wire it in the registry under `components/commands/registries/`

**Customizing the CV:** update data in `lib/cv/cv-pdf.data.ts`, styles in `lib/cv/cv-pdf.styles.ts`, and sections in `components/cv-pdf/CVSections.tsx`.

**Guestbook backend:** SQL schema in `supabase/schema/guestbook.sql`, API in `app/api/guestbook/route.ts`, tune with `GUESTBOOK_*` env vars.

<br />

## CI / CD

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | PR / push to `main` | Lint, typecheck, build |
| `dependency-audit.yml` | PR / weekly | `pnpm audit --prod --audit-level=high` |
| `release.yml` | Push to `main` | Release-please automated versioning |

Deployed on **Vercel** — push to `main` and it ships.

<br />

## Quality Scripts

```bash
pnpm lint          # Biome lint
pnpm format        # Biome format
pnpm typecheck     # tsc --noEmit
pnpm audit         # Dependency audit
```

<br />

## License

MIT — see [LICENSE](LICENSE) for details.

<br />

<div align="center">

Made by [Alexandre Gossard](https://hakkaofdev.fr)

[![GitHub](https://img.shields.io/badge/GitHub-hakkaofdev-white?style=for-the-badge&logo=github&logoColor=fff&labelColor=181717)](https://github.com/hakkaofdev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-hakkaofdev-white?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMC40NDcgMjAuNDUyaC0zLjU1NHYtNS41NjljMC0xLjMyOC0uMDI3LTMuMDM3LTEuODUyLTMuMDM3LTEuODUzIDAtMi4xMzYgMS40NDUtMi4xMzYgMi45Mzl2NS42NjdIOS4zNTFWOWgzLjQxNHYxLjU2MWguMDQ2Yy40NzctLjkgMS42MzctMS44NSAzLjM3LTEuODUgMy42MDEgMCA0LjI2NyAyLjM3IDQuMjY3IDUuNDU1djYuMjg2ek01LjMzNyA3LjQzM2EyLjA2MiAyLjA2MiAwIDAxLTIuMDYzLTIuMDY1IDIuMDY0IDIuMDY0IDAgMTEyLjA2MyAyLjA2NXptMS43ODIgMTMuMDE5SDMuNTU1VjloMy41NjR2MTEuNDUyek0yMi4yMjUgMEgxLjc3MUMuNzkyIDAgMCAuNzc0IDAgMS43Mjl2MjAuNTQyQzAgMjMuMjI3Ljc5MiAyNCAxLjc3MSAyNGgyMC40NTFDMjMuMiAyNCAyNCAyMy4yMjcgMjQgMjIuMjcxVjEuNzI5QzI0IC43NzQgMjMuMiAwIDIyLjIyMiAwaC4wMDN6Ii8+PC9zdmc+Cg==&labelColor=0A66C2)](https://linkedin.com/in/hakkaofdev)
[![Twitter](https://img.shields.io/badge/Twitter-hakkaofdev-white?style=for-the-badge&logo=x&logoColor=fff&labelColor=000)](https://x.com/hakkaofdev)

</div>
