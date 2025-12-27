import { NextResponse } from 'next/server'
import { getOpencodeClient } from '@/lib/opencode'

interface OpenCodeProject {
  id: string
  worktree: string
  vcs?: string
  time?: {
    created?: number
    updated?: number
    initialized?: number
  }
}

function getProjectName(worktree: string): string {
  if (worktree === '/') return 'Global'
  const parts = worktree.split('/')
  return parts[parts.length - 1] || parts[parts.length - 2] || 'Unknown'
}

function getRelativeTime(timestamp: number): 'active' | 'idle' {
  const hourAgo = Date.now() - 60 * 60 * 1000
  return timestamp > hourAgo ? 'active' : 'idle'
}

export async function GET() {
  try {
    const { client } = await getOpencodeClient()

    // Fetch real projects from OpenCode server
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await client.project.list() as any
    const rawProjects = result?.response?.data || result?.data || result || []
    
    const projects: OpenCodeProject[] = Array.isArray(rawProjects) ? rawProjects : []

    // Filter out global project and format
    const formattedProjects = projects
      .filter(p => p.id !== 'global' && p.worktree !== '/')
      .slice(0, 10)
      .map((project) => {
        const lastUpdated = project.time?.updated || project.time?.created || Date.now()
        
        return {
          id: project.id,
          name: getProjectName(project.worktree),
          path: project.worktree,
          status: getRelativeTime(lastUpdated),
          lastModified: new Date(lastUpdated),
          vcs: project.vcs || 'none',
          language: 'TypeScript',
          commits: 0,
          collaborators: 1,
          size: 'N/A'
        }
      })
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())

    return NextResponse.json(formattedProjects)

  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
