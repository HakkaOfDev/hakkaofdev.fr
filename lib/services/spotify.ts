import {
  SPOTIFY_BASE_URL,
  SPOTIFY_TOKEN_ENDPOINT,
} from "@/lib/constants/api.constants";
import type {
  NowPlayingResponse,
  RecentlyPlayedResponse,
  SpotifyEnv,
  SpotifyTokenResponse,
  TopTracksResponse,
} from "@/types/spotify";

// ─── Endpoints ──────────────────────────────────────────────────────────────

const ENDPOINTS = {
  nowPlaying: `${SPOTIFY_BASE_URL}/player/currently-playing`,
  topTracks: `${SPOTIFY_BASE_URL}/top/tracks`,
  recentlyPlayed: `${SPOTIFY_BASE_URL}/player/recently-played`,
} as const;

// ─── Auth ───────────────────────────────────────────────────────────────────

function getSpotifyEnv(): SpotifyEnv | null {
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

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
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

  const json = (await response.json()) as SpotifyTokenResponse;
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
async function getNowPlaying(): Promise<NowPlayingResponse | null> {
  return spotifyFetch<NowPlayingResponse>(ENDPOINTS.nowPlaying);
}

/** Fetches the user's top tracks from Spotify. */
async function getTopTracks(): Promise<TopTracksResponse | null> {
  return spotifyFetch<TopTracksResponse>(ENDPOINTS.topTracks);
}

/** Fetches the user's recently played tracks from Spotify. */
async function getRecentlyPlayed(): Promise<RecentlyPlayedResponse | null> {
  return spotifyFetch<RecentlyPlayedResponse>(ENDPOINTS.recentlyPlayed);
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const SpotifyService = {
  getNowPlaying,
  getTopTracks,
  getRecentlyPlayed,
} as const;
