"use client";

import {
  SPOTIFY_COMMANDS,
  SPOTIFY_COMMAND_RENDERERS,
} from "@/components/commands/spotify-registry";
import SubCommandRouter from "../SubCommandRouter";


function CSpotify({ input }: { input: string }) {
  return (
    <SubCommandRouter
      input={input}
      commands={SPOTIFY_COMMANDS}
      prefix="spotify"
      title="Spotify commands"
      variant="purple"
      renderValid={(subcommand) => {
        const renderer =
          SPOTIFY_COMMAND_RENDERERS[
          subcommand as keyof typeof SPOTIFY_COMMAND_RENDERERS
          ];
        return renderer();
      }}
    />
  );
}

export default CSpotify;
