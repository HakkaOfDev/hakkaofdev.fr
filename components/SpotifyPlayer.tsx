"use client";

import { useQuery } from "@tanstack/react-query";
import { m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { getNowPlaying } from "@/app/actions";

function SpotifyPlayer() {
  const { data } = useQuery({
    queryKey: ["now-playing"],
    queryFn: getNowPlaying,
    refetchInterval: 15000,
    retry: false,
  });

  if (!data || !data.is_playing) return null;

  return (
    <m.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="overflow-hidden border-t border-border/30 dark:border-white/[0.05]"
    >
      <Link
        href={data.item.external_urls.spotify}
        target="_blank"
        className="flex items-center gap-2.5 px-4 py-1.5 group hover:bg-muted/30 dark:hover:bg-white/[0.02] transition-colors duration-150"
      >
        <span className="sr-only">Now playing on Spotify:</span>
        {/* Animated bars */}
        <div
          className="flex items-end gap-[2px] h-3.5 shrink-0"
          aria-hidden="true"
        >
          <m.span
            animate={{ scaleY: [0.3, 1, 0.4, 0.8, 0.3] }}
            transition={{
              duration: 2.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-[2.5px] h-3 bg-chart-2/70 origin-bottom rounded-full"
          />
          <m.span
            animate={{ scaleY: [0.8, 0.3, 1, 0.5, 0.8] }}
            transition={{
              duration: 2.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-[2.5px] h-3 bg-chart-2/70 origin-bottom rounded-full"
          />
          <m.span
            animate={{ scaleY: [0.5, 0.9, 0.3, 1, 0.5] }}
            transition={{
              duration: 2.0,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-[2.5px] h-3 bg-chart-2/70 origin-bottom rounded-full"
          />
        </div>

        {/* Album art */}
        <Image
          src={data.item.album.images[0].url}
          alt={data.item.name}
          width={20}
          height={20}
          quality={75}
          className="h-5 w-5 rounded-sm shrink-0"
        />

        {/* Track info */}
        <span className="text-[11px] text-muted-foreground/80 truncate min-w-0 group-hover:text-muted-foreground transition-colors duration-150">
          <span className="font-medium text-muted-foreground/90 group-hover:text-chart-2 transition-colors duration-150">
            {data.item.name}
          </span>
          <span className="mx-1.5 text-muted-foreground/70">&middot;</span>
          {data.item.artists[0].name}
        </span>
      </Link>
    </m.div>
  );
}

export default SpotifyPlayer;
