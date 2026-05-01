import { SITE } from "@/lib/constants";
import {
  GITHUB_API,
  GITHUB_GRAPHQL,
  REVALIDATE,
} from "@/lib/constants/api.constants";
import type {
  GitHubRepo,
  GitHubRepoStargazersItem,
  GitHubUserResponse,
} from "@/types/github";

const REPOS_PER_PAGE = 100;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Builds common GitHub REST API headers, attaching the token from env when present. */
function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github.v3+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetches repository metadata for the site repo from the GitHub API. */
async function getRepo(): Promise<GitHubRepo | null> {
  const repoPath = SITE.repositoryUrl.replace("https://github.com/", "");

  const response = await fetch(`${GITHUB_API}/repos/${repoPath}`, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE.SHORT },
  });

  if (!response.ok) return null;
  return response.json() as Promise<GitHubRepo>;
}

/** Aggregates stargazers across all owned repositories. */
async function getTotalStars(): Promise<number | null> {
  const username = SITE.handle;

  try {
    let totalStars = 0;
    let page = 1;

    while (true) {
      const response = await fetch(
        `${GITHUB_API}/users/${username}/repos?per_page=${REPOS_PER_PAGE}&page=${page}&type=owner`,
        {
          headers: githubHeaders(),
          next: { revalidate: REVALIDATE.MEDIUM },
        },
      );

      if (!response.ok) return null;

      const repos = (await response.json()) as GitHubRepoStargazersItem[];
      if (!repos.length) break;

      totalStars += repos.reduce(
        (sum, repo) => sum + (repo.stargazers_count || 0),
        0,
      );

      if (repos.length < REPOS_PER_PAGE) break;
      page++;
    }

    return totalStars;
  } catch {
    return null;
  }
}

/** Fetches the total contribution count for the current year via GitHub GraphQL. */
async function getContributions(): Promise<number | null> {
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
      next: { revalidate: REVALIDATE.MEDIUM },
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
async function getCodingSince(): Promise<number | null> {
  const username = SITE.handle;

  try {
    const response = await fetch(`${GITHUB_API}/users/${username}`, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE.LONG },
    });

    if (!response.ok) return null;

    const json = (await response.json()) as GitHubUserResponse;
    if (!json.created_at) return null;

    return new Date(json.created_at).getFullYear();
  } catch {
    return null;
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const GitHubService = {
  getRepo,
  getTotalStars,
  getContributions,
  getCodingSince,
} as const;
