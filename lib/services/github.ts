import { SITE } from "@/lib/constants";
import type { GitHubRepo } from "@/lib/types/github";

// ─── Constants ───────────────────────────────────────────────────────────────

const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = `${GITHUB_API}/graphql`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Builds common GitHub REST API headers with optional Bearer auth. */
function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github.v3+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetches repository metadata for the site repo from the GitHub API. */
export async function getGitHubRepo(): Promise<GitHubRepo | null> {
  const repoPath = SITE.repositoryUrl.replace("https://github.com/", "");

  const response = await fetch(`${GITHUB_API}/repos/${repoPath}`, {
    headers: githubHeaders(),
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;
  return response.json() as Promise<GitHubRepo>;
}

/** Aggregates stargazers across all owned repositories. */
export async function getTotalStars(): Promise<number | null> {
  const username = SITE.handle;

  try {
    let totalStars = 0;
    let page = 1;
    const perPage = 100;

    while (true) {
      const response = await fetch(
        `${GITHUB_API}/users/${username}/repos?per_page=${perPage}&page=${page}&type=owner`,
        {
          headers: githubHeaders(),
          next: { revalidate: 3600 },
        },
      );

      if (!response.ok) return null;

      const repos = (await response.json()) as Array<{
        stargazers_count: number;
      }>;
      if (!repos.length) break;

      totalStars += repos.reduce(
        (sum, repo) => sum + (repo.stargazers_count || 0),
        0,
      );

      if (repos.length < perPage) break;
      page++;
    }

    return totalStars;
  } catch {
    return null;
  }
}

/** Fetches the total contribution count for the current year via GitHub GraphQL. */
export async function getContributions(): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const username = SITE.handle;

  try {
    const response = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
            }
          }
        }`,
        variables: { username },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const json = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions?: number;
            };
          };
        };
      };
    };

    return (
      json.data?.user?.contributionsCollection?.contributionCalendar
        ?.totalContributions ?? null
    );
  } catch {
    return null;
  }
}

/** Returns the year the GitHub account was created. */
export async function getCodingSince(): Promise<number | null> {
  const username = SITE.handle;

  try {
    const response = await fetch(`${GITHUB_API}/users/${username}`, {
      headers: githubHeaders(),
      next: { revalidate: 86400 },
    });

    if (!response.ok) return null;

    const json = (await response.json()) as { created_at?: string };
    if (!json.created_at) return null;

    return new Date(json.created_at).getFullYear();
  } catch {
    return null;
  }
}
