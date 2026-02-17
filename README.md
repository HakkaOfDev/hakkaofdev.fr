# hakkaofdev.fr (v2)

Interactive terminal-style portfolio website for Alexandre Gossard ([@hakkaofdev](https://github.com/hakkaofdev)).

Live: https://hakkaofdev.fr

## Features

- Terminal UI with command input, command history, and autocomplete
- Built-in commands: `help`, `projects`, `skills`, `about`, `education`, `experiences`, `clear`, `reset`, `spotify`
- Optional Spotify integration:
  - Header "Now Playing" widget (polls every 15s)
  - Terminal commands: `spotify now`, `spotify top`, `spotify history`
- Light/dark theme toggle (`next-themes`)
- Animations (`framer-motion` + `motion/react`)
- SEO-friendly metadata + `sitemap.xml` and `robots.txt`
- Dynamic social preview images (`/opengraph-image`, `/twitter-image`) + JSON-LD person schema
- Vercel Speed Insights

## Tech Stack

- Next.js (App Router) + React
- TypeScript
- Tailwind CSS v4 (CSS-first config) + `tailwindcss-animate`
- TanStack Query (`@tanstack/react-query`)
- Spotify Web API (refresh-token flow)

## Getting Started

### Prerequisites

- Node.js (recommended: 22+, see `.node-version`)
- pnpm (repo is pinned to `pnpm@9.14.2`)

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Then open http://localhost:3000

### Production

```bash
pnpm build
pnpm start
```

### Quality / Format

```bash
pnpm lint
pnpm typecheck
pnpm audit
pnpm prettier:fix
```

## Configuration (Environment Variables)

Create a `.env.local` file at the repo root (you can start from `.env.example`):

```bash
# Used by app/sitemap.ts and app/robots.ts
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional (enables Spotify commands + header widget)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

Notes:

- `NEXT_PUBLIC_SITE_URL` is used to build absolute URLs in `app/sitemap.ts` and `app/robots.ts`.
- Spotify variables are read in `app/actions.ts`:
  - Access token is obtained via the Spotify token endpoint using the refresh token.
  - Data is fetched from `currently-playing`, `top/tracks`, and `recently-played`.
- Required Spotify scopes typically include:
  - `user-read-currently-playing` (or `user-read-playback-state`)
  - `user-top-read`
  - `user-read-recently-played`

If you do not set Spotify env vars, Spotify UI will stay hidden and the `spotify ...` commands will return "No data found.".

## Terminal Commands

Top-level commands are defined in `components/commands/command-descriptors.ts` and rendered via `components/commands/registry.tsx`.
Spotify subcommands are described in `components/commands/command-descriptors.ts` and wired in `components/commands/spotify-registry.tsx`.

| Command | What it does |
| --- | --- |
| `help` | List all available commands |
| `projects` | Show projects grid (opens links in a new tab) |
| `skills` | Show categorized skills |
| `about` | Show personal details (languages/hobbies/etc) |
| `education` | Show education timeline |
| `experiences` | Show experience timeline |
| `clear` | Clear terminal history |
| `reset` | Reset terminal to the initial welcome state |
| `spotify` | Show Spotify sub-command help |
| `spotify now` | Show currently playing track |
| `spotify top` | Show top tracks |
| `spotify history` | Show recently played tracks |

## Customization

Most portfolio content lives in `lib/constants.ts`:

- Social links (`SOCIALS`)
- Projects list (`PROJECTS`)
- Skills (`SKILLS`)
- Education (`EDUCATION`)
- Experiences (`EXPERIENCES`)

To add a new terminal command:

1. Add the command + description to `COMMANDS` in `components/commands/command-descriptors.ts` (autocomplete/help + did-you-mean).
2. Create a renderer component in `components/commands/renders/`.
3. Wire it in `components/commands/registry.tsx` (`COMMAND_RENDERERS` map).

To add a new Spotify sub-command:

1. Add the sub-command + description to `SPOTIFY_COMMANDS` in `components/commands/command-descriptors.ts`.
2. Add the renderer in `components/commands/renders/spotify/`.
3. Wire it in `components/commands/spotify-registry.tsx`.

## Deployment

This repo is designed to deploy cleanly to Vercel (Speed Insights is already integrated).

Set these environment variables in your hosting provider:

- `NEXT_PUBLIC_SITE_URL` (e.g. `https://hakkaofdev.fr`)
- Spotify variables if you want Spotify features

## CI

GitHub Actions workflows are included:

- `.github/workflows/ci.yml`: runs `pnpm lint`, `pnpm typecheck`, and `pnpm build` on PRs/pushes to `main`
- `.github/workflows/dependency-audit.yml`: runs `pnpm audit --prod --audit-level=high` on PRs + weekly schedule

## Notes

- Spotify album art comes from `https://i.scdn.co` and is allowlisted via `next.config.ts` (`images.remotePatterns`).

## License

No license file is currently included in this repository.
