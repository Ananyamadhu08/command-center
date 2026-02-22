import { NextResponse } from "next/server"
import { SAMPLE_GITHUB_STATS, SAMPLE_GITHUB_REPOS } from "@/lib/sample-data"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function githubFetch(path: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const repo = searchParams.get("repo")

  if (action === "repos") {
    if (!GITHUB_TOKEN) {
      return NextResponse.json({ success: true, data: SAMPLE_GITHUB_REPOS })
    }
    try {
      const repos = await githubFetch("/user/repos?sort=updated&per_page=30&type=owner")
      const data = repos.map((r: { full_name: string; description: string | null }) => ({
        full_name: r.full_name,
        description: r.description ?? "",
      }))
      return NextResponse.json({ success: true, data })
    } catch {
      return NextResponse.json({ success: true, data: SAMPLE_GITHUB_REPOS })
    }
  }

  if (repo && /^[\w\-\.]+\/[\w\-\.]+$/.test(repo)) {
    if (!GITHUB_TOKEN) {
      const stats = SAMPLE_GITHUB_STATS[repo]
      if (stats) return NextResponse.json({ success: true, data: stats })
      return NextResponse.json({ success: true, data: { open_prs: [], branches: [], recent_commits: [], stars: 0 } })
    }
    try {
      const [prs, branches, commits, repoInfo] = await Promise.all([
        githubFetch(`/repos/${repo}/pulls?state=open&per_page=10`),
        githubFetch(`/repos/${repo}/branches?per_page=20`),
        githubFetch(`/repos/${repo}/commits?per_page=10`),
        githubFetch(`/repos/${repo}`),
      ])

      const data = {
        open_prs: prs.map((p: { number: number; title: string; state: string; user: { login: string }; updated_at: string }) => ({
          number: p.number,
          title: p.title,
          state: p.state,
          author: p.user.login,
          updated_at: p.updated_at,
        })),
        branches: branches.map((b: { name: string }) => ({ name: b.name })),
        recent_commits: commits.map((c: { sha: string; commit: { message: string; author: { name: string; date: string } } }) => ({
          sha: c.sha.slice(0, 7),
          message: c.commit.message.split("\n")[0],
          author: c.commit.author.name,
          date: c.commit.author.date,
        })),
        stars: repoInfo.stargazers_count ?? 0,
      }
      return NextResponse.json({ success: true, data })
    } catch {
      const stats = SAMPLE_GITHUB_STATS[repo]
      if (stats) return NextResponse.json({ success: true, data: stats })
      return NextResponse.json({ success: true, data: { open_prs: [], branches: [], recent_commits: [], stars: 0 } })
    }
  }

  return NextResponse.json({ success: false, error: "Missing action or repo param" }, { status: 400 })
}
