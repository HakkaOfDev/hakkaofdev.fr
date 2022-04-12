export type Artist = {
  id: string;
  name: string;
  href: string;
  uri: string;
  type: 'artist';
  external_urls?: { [source: string]: string };
};
