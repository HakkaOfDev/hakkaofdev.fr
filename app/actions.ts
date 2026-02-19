"use server";

import { GitHubService, SpotifyService, StatsService } from "@/lib/services";

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

export async function getStats() {
  return StatsService.getStats();
}
