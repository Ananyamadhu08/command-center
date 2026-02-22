import { NextResponse } from "next/server"
import { SAMPLE_GITHUB_STATS, SAMPLE_GITHUB_REPOS } from "@/lib/sample-data"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function githubFetch(path: string, cache: RequestCache = "default") {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    ...(cache === "no-store" ? { cache: "no-store" } : { next: { revalidate: 60 } }),
  })
  if (!res.ok) throw new Error(`GitHub API ${path}: ${res.status} ${res.statusText}`)
  return res.json()
}

async function fetchAllRepos() {
  const all: { full_name: string; description: string }[] = []
  let page = 1
  while (true) {
    const batch = await githubFetch(`/user/repos?sort=updated&per_page=100&page=${page}&type=owner`)
    if (!Array.isArray(batch) || batch.length === 0) break
    for (const r of batch) {
      all.push({ full_name: r.full_name, description: r.description ?? "" })
    }
    if (batch.length < 100) break
    page++
  }
  return all
}

function getLocalDateStr(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

async function fetchOverview() {
  const user = await githubFetch("/user", "no-store")
  const login = user.login as string

  const [events, repos] = await Promise.all([
    githubFetch(`/users/${login}/events?per_page=100`, "no-store"),
    fetchAllRepos(),
  ])

  const todayLocal = getLocalDateStr()
  let prsToday = 0
  const reposContributed = new Set<string>()

  for (const event of events) {
    const eventUtc = new Date(event.created_at as string)
    const eventLocal = `${eventUtc.getFullYear()}-${String(eventUtc.getMonth() + 1).padStart(2, "0")}-${String(eventUtc.getDate()).padStart(2, "0")}`
    if (eventLocal !== todayLocal) continue

    reposContributed.add(event.repo.name as string)

    if (event.type === "PullRequestEvent" && event.payload.action === "opened") {
      prsToday++
    }
  }

  const todayISO = new Date(todayLocal + "T00:00:00").toISOString()
  const commitCounts = await Promise.all(
    Array.from(reposContributed).map(async (repoName) => {
      try {
        const commits = await githubFetch(
          `/repos/${repoName}/commits?author=${login}&since=${todayISO}&per_page=100`,
          "no-store"
        )
        return Array.isArray(commits) ? commits.length : 0
      } catch {
        return 0
      }
    })
  )
  const commitsToday = commitCounts.reduce((sum, n) => sum + n, 0)

  return {
    commits_today: commitsToday,
    prs_today: prsToday,
    repos_contributed_today: reposContributed.size,
    total_repos: repos.length,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const repo = searchParams.get("repo")

  if (action === "overview") {
    const EMPTY_OVERVIEW = { commits_today: 0, prs_today: 0, repos_contributed_today: 0, total_repos: 0 }
    if (!GITHUB_TOKEN) {
      return NextResponse.json({ success: true, data: EMPTY_OVERVIEW })
    }
    try {
      const data = await fetchOverview()
      return NextResponse.json({ success: true, data })
    } catch (error) {
      console.error("[GitHub Overview]", error)
      return NextResponse.json({ success: true, data: EMPTY_OVERVIEW })
    }
  }

  if (action === "repos") {
    if (!GITHUB_TOKEN) {
      return NextResponse.json({ success: true, data: SAMPLE_GITHUB_REPOS })
    }
    try {
      const data = await fetchAllRepos()
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
