'use client'

import { useState, useEffect } from 'react'
import { FolderOpen, GitBranch, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Project {
  id: string
  name: string
  path: string
  status: 'active' | 'idle' | 'error'
  lastModified: Date | string
  commits: number
  collaborators: number
  language: string
  size: string
}

export function ProjectOverview() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch projects from API route
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const projectData = await response.json()
        setProjects(projectData)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        // Fallback to simulated projects if connection fails
        setProjects([
          {
            id: '1',
            name: 'WorkAdventure',
            path: '/root/workadventure',
            status: 'active',
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
            status: 'active',
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
            status: 'idle',
            lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000),
            commits: 12,
            collaborators: 1,
            language: 'YAML',
            size: '8.2MB'
          }
        ])
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

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FolderOpen className="h-5 w-5 text-blue-400" />
          Project Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {projects.map((project) => (
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
                  <p className="text-slate-400 text-sm">{project.path}</p>
                </div>
              </div>
              <Badge variant="secondary" className={getStatusColor(project.status)}>
                {getStatusIcon(project.status)}
                <span className="ml-1 capitalize">{project.status}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">{project.commits} commits</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">{project.collaborators} collaborators</span>
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

            <div className="mt-3 pt-3 border-t border-slate-600">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Size: {project.size}</span>
                <div className="flex gap-2">
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    Open in Editor
                  </button>
                  <button className="text-slate-400 hover:text-slate-300 transition-colors">
                    View Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Project Stats Summary */}
        <div className="mt-6 pt-4 border-t border-slate-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{projects.length}</div>
              <div className="text-sm text-slate-400">Total Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {projects.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-slate-400">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {projects.reduce((sum, p) => sum + p.commits, 0)}
              </div>
              <div className="text-sm text-slate-400">Total Commits</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {projects.reduce((sum, p) => sum + p.collaborators, 0)}
              </div>
              <div className="text-sm text-slate-400">Contributors</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
