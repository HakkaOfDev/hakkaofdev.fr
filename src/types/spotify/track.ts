export type Track = {
  album: string;
  albumImageUrl: string;
  artist: string;
  isPlaying?: boolean;
  songUrl: string;
  title: string;
  playedAt?: Date | string;
};
