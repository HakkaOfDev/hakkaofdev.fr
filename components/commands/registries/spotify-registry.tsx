"use client";

import type { ReactNode } from "react";
import CNowPlaying from "../renders/spotify/CNowPlaying";
import CRecentlyPlayed from "../renders/spotify/CRecentlyPlayed";
import CTopTracks from "../renders/spotify/CTopTracks";

export type { SpotifyCommandDescriptor } from "../../../lib/command-descriptors";
export { SPOTIFY_COMMANDS } from "../../../lib/command-descriptors";

export const SPOTIFY_COMMAND_RENDERERS: Record<string, () => ReactNode> = {
  now: () => <CNowPlaying />,
  top: () => <CTopTracks />,
  history: () => <CRecentlyPlayed />,
};
