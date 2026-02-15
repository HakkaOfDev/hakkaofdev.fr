import { getNowPlaying } from "@/app/actions";
import { AnimatedSpan } from "@/components/Terminal";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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
            className="group w-fit"
          >
            <AnimatedSpan className="border flex w-fit items-center gap-3 rounded-lg p-3">
              <Image
                src={data.item.album.images[0].url}
                alt={data.item.name}
                width={50}
                height={50}
                className="rounded-sm"
              />
              <div>
                <p className="text-sm font-semibold group-hover:text-chart-2 transition-colors duration-200">
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
