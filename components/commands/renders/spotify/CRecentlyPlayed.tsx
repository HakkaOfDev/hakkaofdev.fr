import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { getRecentlyPlayed } from "@/app/actions";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import SpotifyQuery from "./SpotifyQuery";

function CRecentlyPlayed() {
  return (
    <SpotifyQuery queryKey={["recently-played"]} queryFn={getRecentlyPlayed}>
      {(data) => (
        <AnimatedSpan className="gap-2">
          {data.items.map((item) => (
            <Link
              key={item.played_at}
              href={item.track.external_urls.spotify}
              target="_blank"
              aria-label={`Open recently played track: ${item.track.name}`}
              className="group flex items-center gap-2 py-1"
            >
              <Image
                src={item.track.album.images[0].url}
                alt={item.track.name}
                width={50}
                height={50}
                className="rounded-sm"
              />
              <div className="flex flex-1 flex-col items-start gap-1 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <p className="line-clamp-1 font-semibold text-sm leading-4 transition-colors duration-200 group-hover:text-primary">
                    {item.track.name}
                  </p>
                  <p className="line-clamp-1 text-muted-foreground">
                    {item.track.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(item.played_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </Link>
          ))}
        </AnimatedSpan>
      )}
    </SpotifyQuery>
  );
}

export default CRecentlyPlayed;
