'use client'

import { useState } from 'react'
import { Terminal, Copy, Check, ChevronDown, ChevronRight, Loader2 } from 'lucide-react'

interface TerminalOutput {
  type: 'stdout' | 'stderr' | 'command' | 'info'
  content: string
  timestamp?: Date
}

interface TerminalBoxProps {
  command: string
  outputs: TerminalOutput[]
  isRunning?: boolean
  isCollapsible?: boolean
  defaultExpanded?: boolean
  exitCode?: number | null
  onCopy?: () => void
}

export function TerminalBox({
  command,
  outputs,
  isRunning = false,
  isCollapsible = true,
  defaultExpanded = true,
  exitCode = null,
}: TerminalBoxProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const fullContent = [
      `$ ${command}`,
      ...outputs.map(o => o.content)
    ].join('\n')
    
    await navigator.clipboard.writeText(fullContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getOutputColor = (type: TerminalOutput['type']) => {
    switch (type) {
      case 'stderr':
        return 'text-red-400'
      case 'command':
        return 'text-blue-400'
      case 'info':
        return 'text-slate-500'
      default:
        return 'text-green-400'
    }
  }

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-slate-600/50 bg-slate-900/80 shadow-lg">
      {/* Terminal Header */}
      <div 
        className="flex items-center justify-between px-3 py-2 bg-slate-800/80 border-b border-slate-700/50 cursor-pointer"
        onClick={() => isCollapsible && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {/* macOS-style dots */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          
          <Terminal className="h-4 w-4 text-slate-400 ml-2" />
          <span className="text-xs text-slate-400 font-mono">Terminal</span>
          
          {isRunning && (
            <div className="flex items-center gap-1 ml-2">
              <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
              <span className="text-xs text-blue-400">Running...</span>
            </div>
          )}
          
          {!isRunning && exitCode !== null && (
            <span className={`text-xs ml-2 ${exitCode === 0 ? 'text-green-400' : 'text-red-400'}`}>
              exit: {exitCode}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleCopy()
            }}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
            )}
          </button>
          
          {isCollapsible && (
            <button className="p-1 hover:bg-slate-700 rounded transition-colors">
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      {expanded && (
        <div className="p-3 font-mono text-sm max-h-64 overflow-y-auto">
          {/* Command prompt */}
          <div className="flex items-start gap-2 text-slate-300">
            <span className="text-emerald-400 select-none">$</span>
            <span className="text-white">{command}</span>
          </div>

          {/* Output lines */}
          {outputs.map((output, index) => (
            <div 
              key={index} 
              className={`mt-1 whitespace-pre-wrap break-all ${getOutputColor(output.type)}`}
            >
              {output.content}
            </div>
          ))}

          {/* Blinking cursor when running */}
          {isRunning && (
            <div className="mt-1 flex items-center">
              <span className="w-2 h-4 bg-green-400 animate-pulse" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface CommandResultProps {
  command: string
  result: string
  error?: string
  isLoading?: boolean
}

export function CommandResult({ command, result, error, isLoading = false }: CommandResultProps) {
  const outputs: TerminalOutput[] = []
  
  if (result) {
    outputs.push({ type: 'stdout', content: result })
  }
  
  if (error) {
    outputs.push({ type: 'stderr', content: error })
  }

  return (
    <TerminalBox
      command={command}
      outputs={outputs}
      isRunning={isLoading}
      exitCode={error ? 1 : (result ? 0 : null)}
    />
  )
}
