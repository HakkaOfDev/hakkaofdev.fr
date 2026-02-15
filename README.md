# hakkaofdev.fr (v2)

Interactive terminal-style portfolio website for Alexandre Gossard ([@hakkaofdev](https://github.com/hakkaofdev)).

Live: https://hakkaofdev.fr

## Features

- Terminal UI with command input, command history, and autocomplete
- Built-in commands: `help`, `projects`, `skills`, `about`, `education`, `experiences`, `clear`, `reset`, `welcome`
- Optional Spotify integration:
  - Header "Now Playing" widget (polls every 15s)
  - Terminal commands: `spotify now`, `spotify top`, `spotify history`
- Light/dark theme toggle (`next-themes`)
- Animations (`framer-motion` + `motion/react`)
- SEO-friendly metadata + `sitemap.xml` and `robots.txt`
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

### Lint / Format

```bash
pnpm lint
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

Commands are defined in `lib/constants.ts` (used for autocomplete/help) and rendered via `components/commands/CommandItem.tsx`.

| Command | What it does |
| --- | --- |
| `welcome` | Show the intro screen |
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

1. Add the command + description to `COMMANDS` in `lib/constants.ts` (for autocomplete/help).
2. Create a renderer component in `components/commands/renders/`.
3. Wire it into the `switch` in `components/commands/CommandItem.tsx`.

## Deployment

This repo is designed to deploy cleanly to Vercel (Speed Insights is already integrated).

Set these environment variables in your hosting provider:

- `NEXT_PUBLIC_SITE_URL` (e.g. `https://hakkaofdev.fr`)
- Spotify variables if you want Spotify features

## Notes

- Spotify album art comes from `https://i.scdn.co` and is allowlisted via `next.config.ts` (`images.remotePatterns`).

## License

No license file is currently included in this repository.
