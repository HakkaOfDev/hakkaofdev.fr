import type {
  Album,
  Artist,
  PlayHistory,
  Track,
} from "@spotify/web-api-ts-sdk";

// ─── Config ──────────────────────────────────────────────────────────────────

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const BASE_URL = "https://api.spotify.com/v1/me";

const ENDPOINTS = {
  nowPlaying: `${BASE_URL}/player/currently-playing`,
  topTracks: `${BASE_URL}/top/tracks`,
  recentlyPlayed: `${BASE_URL}/player/recently-played`,
} as const;

// ─── Response Types ──────────────────────────────────────────────────────────

export type NowPlayingResponse = {
  is_playing: boolean;
  item: {
    album: Album;
    artists: Artist[];
    external_urls: { spotify: string };
    name: string;
  };
};

export type TopTracksResponse = { items: Track[] };

export type RecentlyPlayedResponse = { items: PlayHistory[] };

// ─── Auth ────────────────────────────────────────────────────────────────────

function getSpotifyEnv() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;
  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken(): Promise<string | null> {
  const env = getSpotifyEnv();
  if (!env) return null;

  const basic = Buffer.from(`${env.clientId}:${env.clientSecret}`).toString(
    "base64",
  );

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env.refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const json = (await response.json()) as { access_token?: string };
  return json.access_token ?? null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Authenticated fetch wrapper for the Spotify Web API. */
async function spotifyFetch<T>(endpoint: string): Promise<T | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok || response.status === 204) return null;
  return response.json() as Promise<T>;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetches the currently playing track from Spotify. */
export async function getNowPlaying(): Promise<NowPlayingResponse | null> {
  return spotifyFetch<NowPlayingResponse>(ENDPOINTS.nowPlaying);
}

/** Fetches the user's top tracks from Spotify. */
export async function getTopTracks(): Promise<TopTracksResponse | null> {
  return spotifyFetch<TopTracksResponse>(ENDPOINTS.topTracks);
}

/** Fetches the user's recently played tracks from Spotify. */
export async function getRecentlyPlayed(): Promise<RecentlyPlayedResponse | null> {
  return spotifyFetch<RecentlyPlayedResponse>(ENDPOINTS.recentlyPlayed);
}
