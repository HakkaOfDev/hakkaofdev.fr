// ─── Spotify ────────────────────────────────────────────────────────────────

export const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
export const SPOTIFY_BASE_URL = "https://api.spotify.com/v1/me";

// ─── GitHub ─────────────────────────────────────────────────────────────────

export const GITHUB_API = "https://api.github.com";
export const GITHUB_GRAPHQL = `${GITHUB_API}/graphql`;

// ─── WakaTime ──────────────────────────────────────────────────────────────

export const WAKATIME_API = "https://wakatime.com/api/v1/users/current";

// ─── Revalidation (seconds) ────────────────────────────────────────────────

export const REVALIDATE = { SHORT: 300, MEDIUM: 3600, LONG: 86400 } as const;
