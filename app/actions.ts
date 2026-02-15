"use server";

import { Album, Artist, PlayHistory, Track } from "@spotify/web-api-ts-sdk";

const {
  SPOTIFY_CLIENT_ID: clientId,
  SPOTIFY_CLIENT_SECRET: clientSecret,
  SPOTIFY_REFRESH_TOKEN: refreshToken,
} = process.env;

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played`;

function hasSpotifyEnv() {
  return Boolean(clientId && clientSecret && refreshToken);
}

const getAccessToken = async (): Promise<string | null> => {
  if (!hasSpotifyEnv()) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken as string,
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const json = (await response.json()) as { access_token?: string };
  return json.access_token ?? null;
};

export const getNowPlaying = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok || response.status === 204) return null;

  return response.json() as Promise<{
    is_playing: boolean;
    item: {
      album: Album;
      artists: Artist[];
      external_urls: {
        spotify: string;
      };
      name: string;
    };
  }>;
};

export const getTopTracks = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const response = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  return response.json() as Promise<{
    items: Track[];
  }>;
};

export const getRecentlyPlayed = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  return response.json() as Promise<{
    items: PlayHistory[];
  }>;
};
