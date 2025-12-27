import { NextResponse } from 'next/server'
import { getOpencodeClient } from '@/lib/opencode'

interface OpenCodeAgent {
  name: string
  description?: string
  mode?: string
  hidden?: boolean
}

interface OpenCodeSession {
  id: string
  title?: string
  directory?: string
  time?: {
    created?: number
    updated?: number
  }
  summary?: {
    additions?: number
    deletions?: number
    files?: number
  }
}

function formatUptime(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export async function GET() {
  try {
    const { client } = await getOpencodeClient()

    // Fetch real agents from OpenCode server
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agentsResponse = await client.app.agents() as any
    const rawAgents = agentsResponse?.response?.data || agentsResponse?.data || agentsResponse || []
    
    // Filter to primary/visible agents only
    const agents: OpenCodeAgent[] = Array.isArray(rawAgents) 
      ? rawAgents.filter((a: OpenCodeAgent) => !a.hidden && a.mode !== 'subagent')
      : []

    // Fetch sessions to get activity data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionsResponse = await client.session.list() as any
    const rawSessions = sessionsResponse?.response?.data || sessionsResponse?.data || sessionsResponse || []
    const sessions: OpenCodeSession[] = Array.isArray(rawSessions) ? rawSessions : []

    // Count sessions and get latest activity
    const now = Date.now()
    const recentSessions = sessions.filter(s => {
      const updated = s.time?.updated || 0
      return now - updated < 24 * 60 * 60 * 1000 // Active in last 24h
    })

    // Map agents with real session data
    const formattedAgents = agents.slice(0, 5).map((agent, index) => {
      // Find sessions that might use this agent (heuristic based on title/directory)
      const agentSessions = recentSessions.filter(s => 
        s.title?.toLowerCase().includes(agent.name.toLowerCase()) ||
        (agent.name === 'build' && s.summary && (s.summary.additions || 0) > 0)
      )
      
      const latestSession = sessions[0]
      const lastActivity = latestSession?.time?.updated 
        ? new Date(latestSession.time.updated)
        : new Date()

      const firstSession = sessions[sessions.length - 1]
      const uptime = firstSession?.time?.created 
        ? formatUptime(now - firstSession.time.created)
        : '0m'

      return {
        id: `agent-${agent.name}`,
        name: agent.name,
        description: agent.description || `${agent.name} agent`,
        model: agent.name === 'build' ? 'opencode/grok-code-fast-1' : 
               agent.name === 'plan' ? 'opencode/big-pickle' : 
               'opencode/gpt-5-nano',
        status: index === 0 ? 'running' : 'paused',
        sessions: agent.name === 'build' ? sessions.length : agentSessions.length,
        uptime,
        lastActivity,
        mode: agent.mode || 'primary',
        memory: 64 + (index * 64)
      }
    })

    // If no agents found, return the raw agent data
    if (formattedAgents.length === 0 && agents.length > 0) {
      return NextResponse.json(agents.map((agent, i) => ({
        id: `agent-${agent.name}`,
        name: agent.name,
        description: agent.description,
        model: 'opencode/grok-code-fast-1',
        status: i === 0 ? 'running' : 'paused',
        sessions: 0,
        uptime: '0m',
        lastActivity: new Date(),
        mode: agent.mode,
        memory: 64 + (i * 64)
      })))
    }

    return NextResponse.json(formattedAgents)

  } catch (error) {
    console.error('Agents API error:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}
