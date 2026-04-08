import { NextResponse } from "next/server";

const GITHUB_USERNAME = "rizkyce";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

interface GitHubUser {
  login: string;
  followers: number;
  following: number;
  public_repos: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  avatar_url: string;
  bio: string;
  name: string;
}

interface GitHubRepo {
  name: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  size: number;
  private: boolean;
}

export async function GET() {
  try {
    const isAuthenticated = !!GITHUB_TOKEN;

    // 1. Fetch user profile
    // With token: GET /user (authenticated, includes private repo counts)
    // Without token: GET /users/:username (public only)
    const userUrl = isAuthenticated
      ? "https://api.github.com/user"
      : `https://api.github.com/users/${GITHUB_USERNAME}`;

    const userRes = await fetch(userUrl, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!userRes.ok) throw new Error(`User API: ${userRes.status}`);
    const userData: GitHubUser = await userRes.json();

    // 2. Fetch repos
    // With token: GET /user/repos (includes private repos)
    // Without token: GET /users/:username/repos (public only)
    let allRepos: GitHubRepo[] = [];

    if (isAuthenticated) {
      // Paginate through all repos (public + private)
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const reposRes = await fetch(
          `https://api.github.com/user/repos?per_page=100&page=${page}&affiliation=owner&sort=updated`,
          { headers, next: { revalidate: 3600 } }
        );
        if (!reposRes.ok) throw new Error(`Repos API: ${reposRes.status}`);
        const repos: GitHubRepo[] = await reposRes.json();
        allRepos = allRepos.concat(repos);
        hasMore = repos.length === 100;
        page++;
      }
    } else {
      // Public repos only (no token)
      const reposRes = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
        { headers, next: { revalidate: 3600 } }
      );
      if (!reposRes.ok) throw new Error(`Repos API: ${reposRes.status}`);
      allRepos = await reposRes.json();
    }

    // 3. Calculate stats from real data
    const ownRepos = allRepos.filter((r) => !r.fork);
    const totalStars = ownRepos.reduce((acc, r) => acc + r.stargazers_count, 0);
    const totalRepos = ownRepos.length;

    // 4. Calculate language distribution from ALL repos (including private)
    const langCounts: Record<string, number> = {};
    for (const repo of ownRepos) {
      if (repo.language) {
        langCounts[repo.language] =
          (langCounts[repo.language] || 0) + repo.size;
      }
    }
    const totalSize = Object.values(langCounts).reduce((a, b) => a + b, 0);
    const languages = Object.entries(langCounts)
      .map(([name, size]) => ({
        name,
        percent: Math.round((size / totalSize) * 100),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 8); // Top 8 languages

    return NextResponse.json({
      user: {
        login: userData.login,
        name: userData.name,
        bio: userData.bio,
        avatar_url: userData.avatar_url,
        followers: userData.followers,
        following: userData.following,
        public_repos: userData.public_repos,
        private_repos: userData.total_private_repos ?? 0,
      },
      stats: {
        followers: userData.followers,
        following: userData.following,
        repos: totalRepos,
        stars: totalStars,
        privateRepos: isAuthenticated
          ? ownRepos.filter((r) => r.private).length
          : 0,
      },
      languages,
      isAuthenticated,
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
