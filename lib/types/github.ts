export type GitHubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  default_branch: string;
  license: { spdx_id: string } | null;
  updated_at: string;
};
