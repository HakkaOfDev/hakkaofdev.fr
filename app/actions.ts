"use server";

import {
  AnalyticsService,
  GitHubService,
  SpotifyService,
  StatsService,
} from "@/lib/services";
import type { StatsRange } from "@/types/analytics";

// ─── Spotify ─────────────────────────────────────────────────────────────────

export async function getNowPlaying() {
  return SpotifyService.getNowPlaying();
}

export async function getTopTracks() {
  return SpotifyService.getTopTracks();
}

export async function getRecentlyPlayed() {
  return SpotifyService.getRecentlyPlayed();
}

// ─── GitHub ──────────────────────────────────────────────────────────────────

export async function getGitHubRepo() {
  return GitHubService.getRepo();
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export async function getStats(range: StatsRange = "all") {
  return StatsService.getStats(range);
}

export async function getVisitorCountries(range: StatsRange = "all") {
  return AnalyticsService.getVisitorCountries(range);
}

export async function getBrowserBreakdown(range: StatsRange = "all") {
  return AnalyticsService.getBrowserBreakdown(range);
}

export async function getReferrerBreakdown(range: StatsRange = "all") {
  return AnalyticsService.getReferrerBreakdown(range);
}

export async function getVisitorTrend(range: StatsRange = "30d") {
  return AnalyticsService.getVisitorTrend(range);
}
