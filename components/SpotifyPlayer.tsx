"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={data.item.external_urls.spotify}
        target="_blank"
        aria-label="Spotify Player"
        className="flex items-center group"
      >
        <Image
          src={data.item.album.images[0].url}
          alt={data.item.name}
          width={24}
          height={24}
          quality={75}
          className="max-h-6 rounded-xs"
        />
        <div className="flex flex-col items-start ml-2 mr-1">
          <p className="text-[0.65rem] font-semibold line-clamp-1 max-w-[200px] group-hover:text-chart-2 transition-colors duration-200">
            {data.item.name}
          </p>
          <p className="text-[0.5rem] leading-none text-muted-foreground">
            {data.item.artists[0].name}
          </p>
        </div>
        <div className="flex items-end gap-[2px] h-4 ml-2 overflow-hidden">
          <motion.div
            animate={{
              transform: [
                "scaleY(1.0) translateY(0rem)",
                "scaleY(1.5) translateY(0.4rem)",
                "scaleY(1.0) translateY(0rem)",
              ],
            }}
            transition={{
              delay: 0.1,
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[2px] h-3 bg-chart-2"
          />
          <motion.div
            animate={{
              transform: [
                "scaleY(1.0) translateY(0rem)",
                "scaleY(3) translateY(0rem)",
                "scaleY(1.0) translateY(0rem)",
              ],
            }}
            transition={{
              delay: 0.2,
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[2px] h-2 bg-chart-2"
          />
          <motion.div
            animate={{
              transform: [
                "scaleY(1.0) translateY(0rem)",
                "scaleY(0.5) translateY(0.5rem)",
                "scaleY(1.0) translateY(0rem)",
              ],
            }}
            transition={{
              delay: 0.3,
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[2px] h-4 bg-chart-2"
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default SpotifyPlayer;
