"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getRecentlyPlayed } from "@/app/actions";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { dateLocaleMap } from "@/i18n/date-locales";
import type { Locale } from "@/i18n/routing";
import { filterByGrep } from "@/lib/utils/grep.utils";
import SpotifyQuery from "./SpotifyQuery";

function CRecentlyPlayed() {
  const t = useTranslations("Spotify");
  const locale = useLocale() as Locale;
  const grep = useGrep();
  const grepRaw = useGrepRaw();
  return (
    <SpotifyQuery queryKey={["recently-played"]} queryFn={getRecentlyPlayed}>
      {(data) => {
        const items = filterByGrep(data.items, grep, (item) => [
          item.track.name,
          ...item.track.artists.map((a) => a.name),
          item.track.album.name,
        ]);

        if (grep && items.length === 0) {
          return (
            <AnimatedSpan>
              <p className="text-muted-foreground text-xs">
                {t("noMatches", { pattern: grepRaw })}
              </p>
            </AnimatedSpan>
          );
        }

        return (
          <AnimatedSpan className="gap-2">
            {items.map((item) => (
              <Link
                key={item.played_at}
                href={item.track.external_urls.spotify}
                target="_blank"
                aria-label={t("openRecentlyPlayedAria", {
                  name: item.track.name,
                })}
                className="group flex items-center gap-2 py-1"
              >
                <div className="relative size-[50px] shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={item.track.album.images[0].url}
                    alt={item.track.name}
                    fill
                    sizes="50px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start gap-1 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-semibold text-sm leading-4 transition-colors duration-200 group-hover:text-primary">
                      {item.track.name}
                    </p>
                    <p className="line-clamp-1 text-muted-foreground">
                      {item.track.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(item.played_at), {
                      addSuffix: true,
                      locale: dateLocaleMap[locale],
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </AnimatedSpan>
        );
      }}
    </SpotifyQuery>
  );
}

export default CRecentlyPlayed;
