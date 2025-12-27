'use client'

import { useState, useEffect } from 'react'
import { FolderOpen, GitBranch, Clock, CheckCircle, AlertCircle, Terminal, RefreshCw, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Project {
  id: string
  name: string
  path: string
  status: 'active' | 'idle' | 'error'
  lastModified: Date | string
  vcs?: string
  language: string
}

export function ProjectOverview() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLog, setActionLog] = useState<string[]>([])

  const addLog = (message: string) => {
    setActionLog(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  // Fetch projects from API route
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const projectData = await response.json()
        if (Array.isArray(projectData)) {
          setProjects(projectData)
        }
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'idle': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />
      case 'idle': return <Clock className="h-3 w-3" />
      case 'error': return <AlertCircle className="h-3 w-3" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  const formatLastModified = (date: Date | string) => {
    const now = new Date()
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Unknown'
    }

    const diffMs = now.getTime() - dateObj.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays}d ago`
    } else if (diffHours > 0) {
      return `${diffHours}h ago`
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes}m ago`
    }
  }

  const handleViewLogs = async (project: Project) => {
    addLog(`Requesting logs for ${project.name}...`)
    // This would send a chat message to the AI to fetch logs
    addLog(`Ask the AI: "Show me the logs for ${project.name}"`)
  }

  const handleRestart = async (project: Project) => {
    addLog(`Restart requested for ${project.name}`)
    addLog(`Ask the AI: "Restart the service at ${project.path}"`)
  }

  const handleShell = async (project: Project) => {
    addLog(`Shell access for ${project.name}`)
    addLog(`Ask the AI: "Run shell commands in ${project.path}"`)
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-slate-400">Loading projects from VPS...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FolderOpen className="h-5 w-5 text-blue-400" />
          VPS Projects & Services
        </CardTitle>
        <p className="text-sm text-slate-400">
          Projects visible to OpenCode on your Coolify VPS
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No projects found on VPS</p>
            <p className="text-sm mt-2">Ask the AI to explore your server directories</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-slate-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{project.name}</h4>
                    <p className="text-slate-400 text-sm font-mono">{project.path}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={getStatusColor(project.status)}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1 capitalize">{project.status}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-300">{project.vcs || 'no vcs'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-300">{project.language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-300">{formatLastModified(project.lastModified)}</span>
                </div>
              </div>

              {/* VPS Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-600">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewLogs(project)}
                  className="border-slate-600 hover:bg-slate-700 text-slate-300"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Logs
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRestart(project)}
                  className="border-slate-600 hover:bg-slate-700 text-slate-300"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Restart
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleShell(project)}
                  className="border-slate-600 hover:bg-slate-700 text-slate-300"
                >
                  <Terminal className="h-3 w-3 mr-1" />
                  Shell
                </Button>
              </div>
            </div>
          ))
        )}

        {/* Action Log */}
        {actionLog.length > 0 && (
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-500 mb-2">Action Log:</p>
            {actionLog.map((log, i) => (
              <p key={i} className="text-xs text-slate-400 font-mono">{log}</p>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-6 pt-4 border-t border-slate-600">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{projects.length}</div>
              <div className="text-sm text-slate-400">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {projects.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-slate-400">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {projects.filter(p => p.vcs === 'git').length}
              </div>
              <div className="text-sm text-slate-400">Git Repos</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
