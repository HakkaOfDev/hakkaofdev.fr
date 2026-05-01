"use client";

import { useQuery } from "@tanstack/react-query";
import { m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getNowPlaying } from "@/app/actions";

function SpotifyPlayer() {
  const t = useTranslations("Spotify");
  const { data } = useQuery({
    queryKey: ["now-playing"],
    queryFn: () => getNowPlaying(),
    refetchInterval: 15000,
    retry: false,
  });

  if (!data || !data.is_playing) return null;

  return (
    <m.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="overflow-hidden border-border/30 border-t dark:border-overlay-subtle"
    >
      <Link
        href={data.item.external_urls.spotify}
        target="_blank"
        className="group flex items-center gap-2.5 px-4 py-1.5 transition-colors duration-150 hover:bg-muted/30 dark:hover:bg-overlay-subtle"
      >
        <span className="sr-only">{t("nowPlayingPrefix")}</span>
        {/* Animated bars */}
        <div
          className="flex h-3.5 shrink-0 items-end gap-[2px]"
          aria-hidden="true"
        >
          <m.span
            animate={{ scaleY: [0.3, 1, 0.4, 0.8, 0.3] }}
            transition={{
              duration: 2.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="h-3 w-[2.5px] origin-bottom rounded-full bg-secondary/70"
          />
          <m.span
            animate={{ scaleY: [0.8, 0.3, 1, 0.5, 0.8] }}
            transition={{
              duration: 2.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="h-3 w-[2.5px] origin-bottom rounded-full bg-secondary/70"
          />
          <m.span
            animate={{ scaleY: [0.5, 0.9, 0.3, 1, 0.5] }}
            transition={{
              duration: 2.0,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="h-3 w-[2.5px] origin-bottom rounded-full bg-secondary/70"
          />
        </div>

        {/* Album art */}
        <Image
          src={data.item.album.images[0].url}
          alt={data.item.name}
          width={20}
          height={20}
          quality={75}
          className="h-5 w-5 shrink-0 rounded-sm"
        />

        {/* Track info */}
        <span className="min-w-0 truncate text-muted-foreground/80 text-xs transition-colors duration-150 group-hover:text-muted-foreground">
          <span className="font-medium text-muted-foreground/90 transition-colors duration-150 group-hover:text-secondary">
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
