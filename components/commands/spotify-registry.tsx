"use client";

import type { ReactNode } from "react";
import CNowPlaying from "./renders/spotify/CNowPlaying";
import CTopTracks from "./renders/spotify/CTopTracks";
import CRecentlyPlayed from "./renders/spotify/CRecentlyPlayed";

export { SPOTIFY_COMMANDS } from "./command-descriptors";
export type { SpotifyCommandDescriptor } from "./command-descriptors";

export const SPOTIFY_COMMAND_RENDERERS: Record<string, () => ReactNode> = {
  now: () => <CNowPlaying />,
  top: () => <CTopTracks />,
  history: () => <CRecentlyPlayed />,
};
