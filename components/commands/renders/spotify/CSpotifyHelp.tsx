import { SPOTIFY_COMMANDS } from "@/components/commands/spotify-registry";
import SubCommandHelp from "../SubCommandHelp";

function CSpotifyHelp() {
  return (
    <SubCommandHelp
      title="Spotify commands"
      items={SPOTIFY_COMMANDS}
      prefix="spotify "
      variant="purple"
    />
  );
}

export default CSpotifyHelp;
