'use client'

import { useState, useEffect } from 'react'
import { Server, HardDrive, Cpu, MemoryStick, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: string
  loadAverage: string
}

export function SystemMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    uptime: '0d 0h 0m',
    loadAverage: '0.00, 0.00, 0.00'
  })

  useEffect(() => {
    // Simulate fetching system metrics from the Hetzner server
    const fetchMetrics = async () => {
      try {
        // In production, this would make API calls to your server
        // For now, simulate realistic data
        setMetrics({
          cpu: Math.random() * 100,
          memory: 45 + Math.random() * 30,
          disk: 18 + Math.random() * 5,
          network: Math.random() * 100,
          uptime: '26d 5h 23m', // From actual server data
          loadAverage: `${(Math.random() * 2).toFixed(2)}, ${(Math.random() * 1.5).toFixed(2)}, ${(Math.random() * 1).toFixed(2)}`
        })
      } catch (error) {
        console.error('Failed to fetch system metrics:', error)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number, thresholds: { warning: number; danger: number }) => {
    if (value >= thresholds.danger) return 'text-red-400'
    if (value >= thresholds.warning) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-red-500'
    if (value >= 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Server className="h-5 w-5 text-blue-400" />
          System Monitor
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
            Online
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Server Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Host:</span>
            <span className="text-white ml-2">{process.env.OPEN_CODE_SERVER_URL?.replace('http://', '').replace(':4096', '') || '142.132.171.59'}</span>
          </div>
          <div>
            <span className="text-slate-400">Uptime:</span>
            <span className="text-white ml-2">{metrics.uptime}</span>
          </div>
          <div>
            <span className="text-slate-400">Load Avg:</span>
            <span className="text-white ml-2">{metrics.loadAverage}</span>
          </div>
          <div>
            <span className="text-slate-400">Services:</span>
            <span className="text-green-400 ml-2">WorkAdventure + OpenCode</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          {/* CPU */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-400" />
                <span className="text-slate-300 text-sm">CPU Usage</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(metrics.cpu, { warning: 70, danger: 90 })}`}>
                {metrics.cpu.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metrics.cpu)}`}
                style={{ width: `${Math.min(metrics.cpu, 100)}%` }}
              />
            </div>
          </div>

          {/* Memory */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-green-400" />
                <span className="text-slate-300 text-sm">Memory Usage</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(metrics.memory, { warning: 75, danger: 90 })}`}>
                {metrics.memory.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metrics.memory)}`}
                style={{ width: `${Math.min(metrics.memory, 100)}%` }}
              />
            </div>
          </div>

          {/* Disk */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-purple-400" />
                <span className="text-slate-300 text-sm">Disk Usage</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(metrics.disk, { warning: 80, danger: 95 })}`}>
                {metrics.disk.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metrics.disk)}`}
                style={{ width: `${Math.min(metrics.disk, 100)}%` }}
              />
            </div>
          </div>

          {/* Network */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-400" />
                <span className="text-slate-300 text-sm">Network I/O</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(metrics.network, { warning: 70, danger: 90 })}`}>
                {metrics.network.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metrics.network)}`}
                style={{ width: `${Math.min(metrics.network, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded text-sm transition-colors">
              Restart Services
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded text-sm transition-colors">
              View Logs
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded text-sm transition-colors">
              System Update
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded text-sm transition-colors">
              Backup Data
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
