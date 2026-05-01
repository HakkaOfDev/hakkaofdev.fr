"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTopTracks } from "@/app/actions";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import SpotifyQuery from "./SpotifyQuery";

function CTopTracks() {
  const t = useTranslations("Spotify");
  return (
    <SpotifyQuery queryKey={["top-tracks"]} queryFn={getTopTracks}>
      {(data) => (
        <AnimatedSpan>
          <table className="max-w-full overflow-x-auto">
            <thead>
              <tr className="text-muted-foreground text-xs uppercase">
                <th className="pb-2">{t("topTracks.rank")}</th>
                <th className="px-4 pb-2 text-left">{t("topTracks.track")}</th>
                <th className="pb-2 text-left">{t("topTracks.album")}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="px-4">
                    <Link
                      href={item.external_urls.spotify}
                      target="_blank"
                      aria-label={t("openTopTrackAria", { name: item.name })}
                      className="group flex items-center gap-2 py-1"
                    >
                      <Image
                        src={item.album.images[0].url}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-sm"
                      />
                      <div>
                        <p className="line-clamp-2 font-semibold text-sm leading-4 transition-colors duration-200 group-hover:text-primary">
                          {item.name}
                        </p>
                        <p className="text-muted-foreground">
                          {item.artists[0].name}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <div>
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
      )}
    </SpotifyQuery>
  );
}

export default CTopTracks;
