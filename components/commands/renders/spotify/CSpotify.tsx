import { useMemo } from "react";
import { SPOTIFY_COMMAND_RENDERERS } from "@/components/commands/spotify-registry";
import CNotFound from "../CNotFound";
import CSpotifyHelp from "./CSpotifyHelp";

function CSpotify({ input }: { input: string }) {
  const content = useMemo(() => {
    const [command, arg] = input.split(" ");

    if (command === "spotify" && !arg) return <CSpotifyHelp />;

    if (!arg) return <CSpotifyHelp />;

    const renderer =
      SPOTIFY_COMMAND_RENDERERS[arg as keyof typeof SPOTIFY_COMMAND_RENDERERS];
    if (!renderer) return <CNotFound input={input} />;

    return renderer();
  }, [input]);

  return content;
}

export default CSpotify;
