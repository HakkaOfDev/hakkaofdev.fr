import Image from "next/image";
import Link from "next/link";
import { getTopTracks } from "@/app/actions";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import SpotifyQuery from "./SpotifyQuery";

function CTopTracks() {
  return (
    <SpotifyQuery queryKey={["top-tracks"]} queryFn={getTopTracks}>
      {(data) => (
        <AnimatedSpan>
          <table className="overflow-x-auto max-w-full">
            <thead>
              <tr className="text-muted-foreground uppercase text-xs">
                <th className="pb-2">Rank</th>
                <th className="text-left px-4 pb-2">Track</th>
                <th className="text-left pb-2">Album</th>
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
                      aria-label={`Open top track: ${item.name}`}
                      className="flex items-center gap-2 py-1 group"
                    >
                      <Image
                        src={item.album.images[0].url}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-sm"
                      />
                      <div>
                        <p className="text-sm leading-4 line-clamp-2 font-semibold group-hover:text-chart-1 transition-colors duration-200">
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
                        aria-label={`Open top album: ${item.album.name}`}
                        className="hover:text-chart-1 leading-4 font-semibold line-clamp-2 text-sm transition-colors duration-200"
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
