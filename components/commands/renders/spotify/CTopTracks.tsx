import { getTopTracks } from "@/app/actions";
import { AnimatedSpan } from "@/components/Terminal";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function CTopTracks() {
  const { data, isLoading } = useQuery({
    queryKey: ["top-tracks"],
    queryFn: getTopTracks,
    retry: false,
  });

  if (isLoading) return <Loader size={16} className="animate-spin" />;

  if (!data) return <p className="text-destructive">No data found.</p>;

  return (
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
          {data?.items.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td className="px-4">
                <Link
                  href={item.external_urls.spotify}
                  target="_blank"
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
                    <p className="text-sm leading-4 line-clamp-2 font-semibold group-hover:text-chart-2 transition-colors duration-200">
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
                    className="hover:text-chart-2 leading-4 font-semibold line-clamp-2 text-sm transition-colors duration-200"
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
}

export default CTopTracks;
