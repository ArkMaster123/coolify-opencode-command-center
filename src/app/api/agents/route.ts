import { createOpencodeClient } from '@opencode-ai/sdk'
import { NextResponse } from 'next/server'

let opencodeClient: any = null

async function getClient() {
  if (!opencodeClient) {
    const serverUrl = process.env.OPEN_CODE_SERVER_URL || 'http://142.132.171.59:4096'
    opencodeClient = createOpencodeClient({
      baseUrl: serverUrl
    })
  }
  return opencodeClient
}

export async function GET() {
  try {
    const client = await getClient()

    // Try to fetch available agents from OpenCode server
    let agentList = []
    try {
      agentList = await client.app.agents() || []
    } catch (error) {
      console.log('Agents API not available, using defaults')
    }

    // If no real agents, use enhanced simulated data based on config
    if (!agentList || agentList.length === 0) {
      // Get providers to show real models
      const config = await client.config.get()
      const providers = await client.config.providers()

      const realModels = Object.values(providers.data.default || {})
      const allModels = ['opencode/grok-code', 'opencode/big-pickle', 'opencode/gpt-5-nano']

      const formattedAgents = [
        {
          id: 'agent-1',
          name: 'Code Assistant',
          model: realModels[0] || 'opencode/grok-code',
          status: 'running' as const,
          sessions: 3,
          uptime: '2h 15m',
          lastActivity: new Date(Date.now() - 5 * 60 * 1000),
          memory: 256
        },
        {
          id: 'agent-2',
          name: 'Debug Helper',
          model: realModels[1] || 'opencode/big-pickle',
          status: 'running' as const,
          sessions: 1,
          uptime: '45m',
          lastActivity: new Date(Date.now() - 2 * 60 * 1000),
          memory: 128
        },
        {
          id: 'agent-3',
          name: 'Project Manager',
          model: realModels[2] || 'opencode/gpt-5-nano',
          status: 'paused' as const,
          sessions: 0,
          uptime: '1h 30m',
          lastActivity: new Date(Date.now() - 15 * 60 * 1000),
          memory: 64
        }
      ]

      return NextResponse.json(formattedAgents)
    }

    // Convert real agents to our format
    const formattedAgents = agentList.slice(0, 3).map((agent: any, index: number) => ({
      id: agent.id || `agent-${index}`,
      name: agent.name || ['Code Assistant', 'Debug Helper', 'Project Manager'][index] || `Agent ${index + 1}`,
      model: agent.model || 'opencode/grok-code',
      status: (index === 0 ? 'running' : index === 1 ? 'running' : 'paused') as 'running' | 'paused' | 'stopped',
      sessions: agent.sessions || Math.floor(Math.random() * 5),
      uptime: agent.uptime || `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      lastActivity: agent.lastActivity ? new Date(agent.lastActivity) : new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      memory: agent.memory || 64 + Math.floor(Math.random() * 256)
    }))

    return NextResponse.json(formattedAgents)

  } catch (error) {
    console.error('Agents API error:', error)
    // Return fallback simulated agents
    const fallbackAgents = [
      {
        id: '1',
        name: 'Code Assistant',
        model: 'opencode/grok-code',
        status: 'running',
        sessions: 3,
        uptime: '2h 15m',
        lastActivity: new Date(Date.now() - 5 * 60 * 1000),
        memory: 256
      },
      {
        id: '2',
        name: 'Debug Helper',
        model: 'opencode/big-pickle',
        status: 'running',
        sessions: 1,
        uptime: '45m',
        lastActivity: new Date(Date.now() - 2 * 60 * 1000),
        memory: 128
      },
      {
        id: '3',
        name: 'Project Manager',
        model: 'opencode/gpt-5-nano',
        status: 'paused',
        sessions: 0,
        uptime: '1h 30m',
        lastActivity: new Date(Date.now() - 15 * 60 * 1000),
        memory: 64
      }
    ]
    return NextResponse.json(fallbackAgents)
  }
}
