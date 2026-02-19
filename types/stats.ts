export type WakaTimeStats = {
  codingTime: string | null;
  dailyAverage: string | null;
  topLanguage: string | null;
};

export type StatsData = {
  wakatime: WakaTimeStats;
  totalStars: number | null;
  contributions: number | null;
  codingSince: number | null;
  visitors: number | null;
};
