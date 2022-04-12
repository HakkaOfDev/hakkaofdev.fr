import { Artist } from '@/types/spotify/artist';
import { Track } from '@/types/spotify/track';
import { getTopTracks } from '@/utils/spotify';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await getTopTracks();
  const { items } = await response.json();

  const tracks: Track[] = items.slice(0, 20).map((track) => ({
    artist: track.artists.map((_artist: Artist) => _artist.name).join(', '),
    album: track.album.name,
    albumImageUrl: track.album.images[0].url,
    songUrl: track.external_urls.spotify,
    title: track.name,
  }));

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200'
  );

  return res.status(200).json({ tracks });
}
