import { useMemo } from "react";
import CNowPlaying from "./CNowPlaying";
import CNotFound from "../CNotFound";
import CSpotifyHelp from "./CSpotifyHelp";
import CTopTracks from "./CTopTracks";
import CRecentlyPlayed from "./CRecentlyPlayed";

function CSpotify({ input }: { input: string }) {
  const content = useMemo(() => {
    const [command, arg] = input.split(" ");

    if (command === "spotify" && !arg) return <CSpotifyHelp />;

    switch (arg) {
      case "now":
        return <CNowPlaying />;
      case "top":
        return <CTopTracks />;
      case "history":
        return <CRecentlyPlayed />;
      default:
        return <CNotFound input={input} />;
    }
  }, [input]);

  return content;
}

export default CSpotify;
