"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTopTracks } from "@/app/actions";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { filterByGrep } from "@/lib/utils/grep.utils";
import SpotifyQuery from "./SpotifyQuery";

function CTopTracks() {
  const t = useTranslations("Spotify");
  const grep = useGrep();
  const grepRaw = useGrepRaw();
  return (
    <SpotifyQuery queryKey={["top-tracks"]} queryFn={getTopTracks}>
      {(data) => {
        const ranked = data.items.map((item, index) => ({
          item,
          rank: index + 1,
        }));
        const filtered = filterByGrep(ranked, grep, ({ item }) => [
          item.name,
          ...item.artists.map((a) => a.name),
          item.album.name,
        ]);

        if (grep && filtered.length === 0) {
          return (
            <AnimatedSpan>
              <p className="text-muted-foreground text-xs">
                {t("noMatches", { pattern: grepRaw })}
              </p>
            </AnimatedSpan>
          );
        }

        return (
          <AnimatedSpan>
            <table className="w-full max-w-full table-fixed">
              <colgroup>
                <col className="w-10" />
                <col className="w-1/2" />
                <col />
              </colgroup>
              <thead>
                <tr className="text-muted-foreground text-xs uppercase">
                  <th className="pb-2 text-left">{t("topTracks.rank")}</th>
                  <th className="px-4 pb-2 text-left">
                    {t("topTracks.track")}
                  </th>
                  <th className="pb-2 text-left">{t("topTracks.album")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ item, rank }) => (
                  <tr key={item.id}>
                    <td className="text-left align-middle tabular-nums">
                      {rank}
                    </td>
                    <td className="px-4 text-left align-middle">
                      <Link
                        href={item.external_urls.spotify}
                        target="_blank"
                        aria-label={t("openTopTrackAria", { name: item.name })}
                        className="group flex items-center gap-2 py-1"
                      >
                        <div className="relative size-[50px] shrink-0 overflow-hidden rounded-sm">
                          <Image
                            src={item.album.images[0].url}
                            alt={item.name}
                            fill
                            sizes="50px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 font-semibold text-sm leading-4 transition-colors duration-200 group-hover:text-primary">
                            {item.name}
                          </p>
                          <p className="truncate text-muted-foreground">
                            {item.artists[0].name}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="text-left align-middle">
                      <div className="min-w-0">
                        <Link
                          href={item.album.external_urls.spotify}
                          target="_blank"
                          aria-label={t("openTopAlbumAria", {
                            name: item.album.name,
                          })}
                          className="line-clamp-2 font-semibold text-sm leading-4 transition-colors duration-200 hover:text-primary"
                        >
                          {item.album.name}
                        </Link>
                        <p className="text-muted-foreground">
                          {new Date(item.album.release_date).getFullYear()}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AnimatedSpan>
        );
      }}
    </SpotifyQuery>
  );
}

export default CTopTracks;
