import { createOpencodeClient } from '@opencode-ai/sdk'
import { NextResponse } from 'next/server'

let opencodeClient: any = null

async function getClient() {
  if (!opencodeClient) {
    opencodeClient = createOpencodeClient({
      baseUrl: 'http://142.132.171.59:4096'
    })
  }
  return opencodeClient
}

export async function GET() {
  try {
    const client = await getClient()

    // Fetch projects from OpenCode server
    const projectList = await client.project.list()

    // Convert to our Project format with simulated data for demo
    const formattedProjects = projectList.slice(0, 3).map((project: any, index: number) => ({
      id: project.id || `project-${index}`,
      name: ['WorkAdventure', 'AI Command Center', 'Coolify Config'][index] || `Project ${index + 1}`,
      path: ['/root/workadventure', '/var/www/ai-command-center', '/root/coolify'][index] || `/project-${index}`,
      status: (index === 0 ? 'active' : index === 1 ? 'active' : 'idle') as 'active' | 'idle',
      lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      commits: Math.floor(Math.random() * 500) + 10,
      collaborators: Math.floor(Math.random() * 10) + 1,
      language: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust'][Math.floor(Math.random() * 5)],
      size: `${(Math.random() * 5).toFixed(1)}${['MB', 'GB'][Math.floor(Math.random() * 2)]}`
    }))

    return NextResponse.json(formattedProjects)

  } catch (error) {
    console.error('Projects API error:', error)
    // Return fallback simulated projects
    const fallbackProjects = [
      {
        id: '1',
        name: 'WorkAdventure',
        path: '/root/workadventure',
        status: 'active' as const,
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
        commits: 245,
        collaborators: 8,
        language: 'TypeScript',
        size: '2.4GB'
      },
      {
        id: '2',
        name: 'AI Command Center',
        path: '/var/www/ai-command-center',
        status: 'active' as const,
        lastModified: new Date(Date.now() - 30 * 60 * 1000),
        commits: 89,
        collaborators: 2,
        language: 'TypeScript',
        size: '45MB'
      },
      {
        id: '3',
        name: 'Coolify Config',
        path: '/root/coolify',
        status: 'idle' as const,
        lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000),
        commits: 12,
        collaborators: 1,
        language: 'YAML',
        size: '8.2MB'
      }
    ]
    return NextResponse.json(fallbackProjects)
  }
}
