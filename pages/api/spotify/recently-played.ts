import { Artist } from '@/types/spotify/artist';
import { Track } from '@/types/spotify/track';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getRecentlyPlayed } from '../../../src/utils/spotify';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await getRecentlyPlayed();
  const { items } = await response.json();

  const tracks: Track[] = items.map((track) => ({
    artist: track.track.artists
      .map((_artist: Artist) => _artist.name)
      .join(', '),
    album: track.track.album.name,
    albumImageUrl: track.track.album.images[0].url,
    songUrl: track.track.external_urls.spotify,
    title: track.track.name,
    playedAt: new Date(track.played_at.split('.')[0]).toLocaleString(),
  }));

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200'
  );

  return res.status(200).json({ tracks });
}
