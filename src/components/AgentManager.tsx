'use client'

import { useState, useEffect } from 'react'
import { Bot, Play, Pause, Square, Settings, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Agent {
  id: string
  name: string
  model: string
  status: 'running' | 'paused' | 'stopped' | 'error'
  sessions: number
  uptime: string
  lastActivity: Date
  memory: number
}

export function AgentManager() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch agents from API route
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents')
        const agentData = await response.json()
        setAgents(agentData)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch agents:', error)
        // Fallback to simulated agents if connection fails
        setAgents([
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
        ])
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'paused': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'stopped': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'running': return <Play className="h-3 w-3" />
      case 'paused': return <Pause className="h-3 w-3" />
      case 'stopped': return <Square className="h-3 w-3" />
      case 'error': return <div className="h-3 w-3 bg-red-400 rounded-full" />
      default: return <Square className="h-3 w-3" />
    }
  }

  const handleAgentAction = (agentId: string, action: 'start' | 'pause' | 'stop' | 'restart') => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        let newStatus: Agent['status']
        switch (action) {
          case 'start':
            newStatus = 'running'
            break
          case 'pause':
            newStatus = 'paused'
            break
          case 'stop':
            newStatus = 'stopped'
            break
          case 'restart':
            newStatus = 'running'
            break
          default:
            newStatus = agent.status
        }
        return { ...agent, status: newStatus, lastActivity: new Date() }
      }
      return agent
    }))
  }

  const addNewAgent = () => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: `Agent ${agents.length + 1}`,
      model: 'opencode/grok-code',
      status: 'stopped',
      sessions: 0,
      uptime: '0m',
      lastActivity: new Date(),
      memory: 128
    }
    setAgents(prev => [...prev, newAgent])
  }

  const removeAgent = (agentId: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== agentId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-400" />
            AI Agents
          </h3>
          <p className="text-slate-400 text-sm">Manage your AI coding assistants</p>
        </div>
        <Button onClick={addNewAgent} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                <Badge variant="secondary" className={getStatusColor(agent.status)}>
                  {getStatusIcon(agent.status)}
                  <span className="ml-1 capitalize">{agent.status}</span>
                </Badge>
              </div>
              <p className="text-sm text-slate-400">{agent.model}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Sessions:</span>
                  <span className="text-white ml-2">{agent.sessions}</span>
                </div>
                <div>
                  <span className="text-slate-400">Memory:</span>
                  <span className="text-white ml-2">{agent.memory}MB</span>
                </div>
                <div>
                  <span className="text-slate-400">Uptime:</span>
                  <span className="text-white ml-2">{agent.uptime}</span>
                </div>
                <div>
                  <span className="text-slate-400">Last Activity:</span>
                  <span className="text-white ml-2">
                    {agent.lastActivity.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2 pt-2">
                {agent.status !== 'running' && (
                  <Button
                    size="sm"
                    onClick={() => handleAgentAction(agent.id, 'start')}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Start
                  </Button>
                )}

                {agent.status === 'running' && (
                  <Button
                    size="sm"
                    onClick={() => handleAgentAction(agent.id, 'pause')}
                    className="bg-yellow-600 hover:bg-yellow-700 flex-1"
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </Button>
                )}

                {agent.status !== 'stopped' && (
                  <Button
                    size="sm"
                    onClick={() => handleAgentAction(agent.id, 'stop')}
                    variant="outline"
                    className="border-slate-600 hover:bg-slate-700 flex-1"
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => handleAgentAction(agent.id, 'restart')}
                  variant="outline"
                  className="border-slate-600 hover:bg-slate-700"
                >
                  <Settings className="h-3 w-3" />
                </Button>

                <Button
                  size="sm"
                  onClick={() => removeAgent(agent.id)}
                  variant="outline"
                  className="border-red-600 hover:bg-red-700 text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Agent Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{agents.length}</div>
              <div className="text-sm text-slate-400">Total Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {agents.filter(a => a.status === 'running').length}
              </div>
              <div className="text-sm text-slate-400">Running</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {agents.filter(a => a.status === 'paused').length}
              </div>
              <div className="text-sm text-slate-400">Paused</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {agents.reduce((sum, a) => sum + a.sessions, 0)}
              </div>
              <div className="text-sm text-slate-400">Active Sessions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
