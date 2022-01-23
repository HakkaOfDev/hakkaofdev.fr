import { Raindrop } from '@/types/raindrop';

export const getRaindrops = async (
  collection: string,
  perPage: number = 50,
  page: number = 0
) => {
  const raindrops: Raindrop[] = [];
  const req = await fetch(
    `https://api.raindrop.io/rest/v1/raindrops/${collection}?perpage=${perPage}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.RAINDROP_TOKEN}`,
      },
    }
  );

  const data = await req.json();

  raindrops.push(
    ...data.items.map(({ title, excerpt, cover, link, tags }) => ({
      title,
      excerpt,
      cover,
      link,
      tags,
    }))
  );

  if (data.items.length === perPage) {
    raindrops.push(...(await getRaindrops(collection, perPage, page + 1)));
  }

  return raindrops;
};
