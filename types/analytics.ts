export type VisitorCountry = {
  country: string;
  unique_count: number;
  total_hits: number;
};

export type UniqueVisitorsResult = {
  total: number;
  last_30d: number;
  today: number;
};
