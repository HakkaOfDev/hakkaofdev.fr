import Image from "next/image";
import Link from "next/link";
import { getNowPlaying } from "@/app/actions";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import SpotifyQuery from "./SpotifyQuery";

function CNowPlaying() {
  return (
    <SpotifyQuery queryKey={["now-playing"]} queryFn={getNowPlaying}>
      {(data) => {
        if (!data.is_playing) return <p>Not playing 😕</p>;

        return (
          <Link
            href={data.item.external_urls.spotify}
            target="_blank"
            aria-label={`Open now playing track: ${data.item.name}`}
            className="group w-fit"
          >
            <AnimatedSpan className="flex w-fit items-center gap-3 rounded-lg border p-3">
              <Image
                src={data.item.album.images[0].url}
                alt={data.item.name}
                width={50}
                height={50}
                className="rounded-sm"
              />
              <div>
                <p className="font-semibold text-sm transition-colors duration-200 group-hover:text-primary">
                  {data.item.name}
                </p>
                <p className="text-muted-foreground">
                  {data.item.artists.map((a) => a.name).join(", ")}
                </p>
              </div>
            </AnimatedSpan>
          </Link>
        );
      }}
    </SpotifyQuery>
  );
}

export default CNowPlaying;
