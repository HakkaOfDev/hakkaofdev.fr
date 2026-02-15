import { getRecentlyPlayed } from "@/app/actions";
import { AnimatedSpan } from "@/components/Terminal";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function CRecentlyPlayed() {
  const { data, isLoading } = useQuery({
    queryKey: ["recently-played"],
    queryFn: getRecentlyPlayed,
    retry: false,
  });

  if (isLoading) return <Loader size={16} className="animate-spin" />;

  if (!data)
    return (
      <p className="text-destructive">
        Spotify is not configured or is unavailable.
      </p>
    );

  return (
    <AnimatedSpan className="gap-2">
      {data.items.map((item) => (
        <Link
          key={item.played_at}
          href={item.track.external_urls.spotify}
          target="_blank"
          className="flex items-center gap-2 py-1 group"
        >
          <Image
            src={item.track.album.images[0].url}
            alt={item.track.name}
            width={50}
            height={50}
            className="rounded-sm"
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center flex-1 gap-1">
            <div className="flex-1">
              <p className="text-sm leading-4 line-clamp-1 font-semibold group-hover:text-chart-2 transition-colors duration-200">
                {item.track.name}
              </p>
              <p className="text-muted-foreground line-clamp-1">
                {item.track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
            <p className="text-[0.7rem] text-muted-foreground">
              {formatDistanceToNow(new Date(item.played_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </Link>
      ))}
    </AnimatedSpan>
  );
}

export default CRecentlyPlayed;
