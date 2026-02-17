"use server";

import * as githubService from "@/lib/services/github";
import * as spotifyService from "@/lib/services/spotify";
import * as statsService from "@/lib/services/stats";

// ─── Spotify ─────────────────────────────────────────────────────────────────

export async function getNowPlaying() {
  return spotifyService.getNowPlaying();
}

export async function getTopTracks() {
  return spotifyService.getTopTracks();
}

export async function getRecentlyPlayed() {
  return spotifyService.getRecentlyPlayed();
}

// ─── GitHub ──────────────────────────────────────────────────────────────────

export async function getGitHubRepo() {
  return githubService.getGitHubRepo();
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export async function getStats() {
  return statsService.getStats();
}
