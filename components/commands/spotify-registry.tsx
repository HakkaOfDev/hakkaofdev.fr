"use client";

import type { ReactNode } from "react";
import CNowPlaying from "./renders/spotify/CNowPlaying";
import CTopTracks from "./renders/spotify/CTopTracks";
import CRecentlyPlayed from "./renders/spotify/CRecentlyPlayed";

export type SpotifyCommandDescriptor = {
  command: "now" | "top" | "history";
  description: string;
};

type SpotifyCommandDef = SpotifyCommandDescriptor & {
  render: () => ReactNode;
};

export const SPOTIFY_COMMAND_DEFS: SpotifyCommandDef[] = [
  {
    command: "now",
    description: "Display the currently playing song",
    render: () => <CNowPlaying />,
  },
  {
    command: "top",
    description: "Display my top tracks",
    render: () => <CTopTracks />,
  },
  {
    command: "history",
    description: "Display my listening history",
    render: () => <CRecentlyPlayed />,
  },
];

export const SPOTIFY_COMMANDS: SpotifyCommandDescriptor[] =
  SPOTIFY_COMMAND_DEFS.map(({ command, description }) => ({
    command,
    description,
  }));

export const SPOTIFY_COMMAND_RENDERERS: Record<
  SpotifyCommandDescriptor["command"],
  () => ReactNode
> = Object.fromEntries(
  SPOTIFY_COMMAND_DEFS.map((c) => [c.command, c.render])
  // Object.fromEntries cannot preserve the string-literal key union.
) as Record<SpotifyCommandDescriptor["command"], () => ReactNode>;
