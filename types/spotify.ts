import type {
  Album,
  Artist,
  PlayHistory,
  Track,
} from "@spotify/web-api-ts-sdk";

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

export type SpotifyTokenResponse = {
  access_token?: string;
};

export type SpotifyEnv = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};
