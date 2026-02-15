import { SPOTIFY_COMMANDS } from "@/components/commands/spotify-registry";
import CommandList from "../CommandList";

function CSpotifyHelp() {
  return <CommandList items={SPOTIFY_COMMANDS} prefix="spotify " />;
}

export default CSpotifyHelp;
