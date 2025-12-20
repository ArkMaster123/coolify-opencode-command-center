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

    // Fetch available agents from OpenCode server
    const agentList = await client.app.agents()

    // Convert to our Agent format with simulated data for demo
    const formattedAgents = agentList.slice(0, 3).map((agent: any, index: number) => ({
      id: agent.id || `agent-${index}`,
      name: ['Code Assistant', 'Debug Helper', 'Project Manager'][index] || `Agent ${index + 1}`,
      model: ['opencode/grok-code', 'opencode/big-pickle', 'opencode/gpt-5-nano'][index] || 'opencode/grok-code',
      status: (index === 0 ? 'running' : index === 1 ? 'running' : 'paused') as 'running' | 'paused' | 'stopped',
      sessions: Math.floor(Math.random() * 5) + (index === 0 ? 3 : index === 1 ? 1 : 0),
      uptime: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      memory: 64 + Math.floor(Math.random() * 256)
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
