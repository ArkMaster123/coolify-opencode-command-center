'use client'

import { useState, useEffect } from 'react'
import { Activity, Cpu, HardDrive, Users, MessageSquare, Bot, Settings, Play, Pause, Square } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatInterface } from '@/components/ChatInterface'
import { SystemMonitor } from '@/components/SystemMonitor'
import { AgentManager } from '@/components/AgentManager'
import { ProjectOverview } from '@/components/ProjectOverview'

export default function CommandCenter() {
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    activeAgents: 0,
    totalSessions: 0,
    uptime: '0d 0h 0m'
  })

  const [activeTab, setActiveTab] = useState('overview')
  const [opencodeConnected, setOpencodeConnected] = useState(false)

  // Check OpenCode connection via API route
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/status')
        const data = await response.json()
        setOpencodeConnected(data.connected)
      } catch (error) {
        setOpencodeConnected(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpu: Math.random() * 100,
        memory: 45 + Math.random() * 30,
        disk: 18 + Math.random() * 5,
        activeAgents: Math.floor(Math.random() * 5) + 1,
        totalSessions: prev.totalSessions + Math.floor(Math.random() * 3)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Bot className="h-10 w-10 text-blue-400" />
          AI Agent Command Center
        </h1>
        <p className="text-slate-400 text-lg">
          Monitor, control, and interact with your AI coding agents in real-time
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            System Online
          </Badge>
          <Badge variant="outline" className="text-slate-300">
            OpenCode v1.0.180
          </Badge>
          <Badge
            variant="secondary"
            className={opencodeConnected ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${opencodeConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            {opencodeConnected ? 'OpenCode Connected' : 'OpenCode Offline'}
          </Badge>
        </div>
      </div>

      {/* System Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.cpu.toFixed(1)}%</div>
            <p className="text-xs text-slate-400">
              {systemStats.cpu < 50 ? 'Normal' : systemStats.cpu < 80 ? 'Moderate' : 'High'} load
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Memory</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.memory.toFixed(1)}%</div>
            <p className="text-xs text-slate-400">
              {Math.round((systemStats.memory / 100) * 4)}GB used
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.activeAgents}</div>
            <p className="text-xs text-slate-400">
              Running sessions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.totalSessions}</div>
            <p className="text-xs text-slate-400">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600">AI Chat</TabsTrigger>
          <TabsTrigger value="agents" className="data-[state=active]:bg-blue-600">Agents</TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemMonitor />
            <ProjectOverview />
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <ChatInterface />
        </TabsContent>

        <TabsContent value="agents">
          <AgentManager />
        </TabsContent>

        <TabsContent value="projects">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Project Management</h3>
            <p className="text-slate-400">Project management interface coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}