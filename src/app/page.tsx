'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Bot, User, Loader2, Terminal, HardDrive, Container, Activity, Server, RefreshCw, Copy, Check, ChevronDown, ChevronRight, Sparkles, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TerminalOutput {
  type: 'stdout' | 'stderr' | 'command' | 'info'
  content: string
}

interface CommandBlock {
  command: string
  outputs: TerminalOutput[]
  exitCode: number | null
  isRunning: boolean
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  reasoning?: string
  commands?: CommandBlock[]
  timestamp: Date | string
  isStreaming?: boolean
}

const MODELS = [
  { id: 'opencode/grok-code', name: 'Grok Fast', icon: '⚡' },
  { id: 'opencode/big-pickle', name: 'Big Pickle', icon: '🥒' },
  { id: 'opencode/gpt-5-nano', name: 'GPT-5 Nano', icon: '🔬' },
  { id: 'opencode/glm-4.7-free', name: 'GLM-4.7', icon: '🧠' },
]

function ReasoningWidget({ reasoning }: { reasoning: string }) {
  const [expanded, setExpanded] = useState(false)
  
  if (!reasoning) return null
  
  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors group"
      >
        <div className="p-1 rounded-md bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
          <Brain className="h-3 w-3" />
        </div>
        <span>Reasoning</span>
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {!expanded && (
          <span className="text-slate-500 text-[10px] ml-1">click to expand</span>
        )}
      </button>
      {expanded && (
        <div className="mt-2 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 text-xs text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-purple-400 mb-2 pb-2 border-b border-purple-500/20">
            <Sparkles className="h-3 w-3" />
            <span className="font-medium">AI Thinking Process</span>
          </div>
          {reasoning}
        </div>
      )}
    </div>
  )
}

function TerminalBox({ block }: { block: CommandBlock }) {
  const [expanded, setExpanded] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const fullContent = [`$ ${block.command}`, ...block.outputs.map(o => o.content)].join('\n')
    await navigator.clipboard.writeText(fullContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-slate-600/50 bg-slate-900/90 shadow-lg">
      <div 
        className="flex items-center justify-between px-3 py-2 bg-slate-800/90 border-b border-slate-700/50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <Terminal className="h-3.5 w-3.5 text-slate-400 ml-2" />
          <code className="text-xs text-slate-300 font-mono truncate max-w-[200px]">$ {block.command}</code>
          {block.isRunning && <Loader2 className="h-3 w-3 animate-spin text-blue-400 ml-2" />}
          {!block.isRunning && block.exitCode !== null && (
            <span className={`text-xs ml-2 ${block.exitCode === 0 ? 'text-green-400' : 'text-red-400'}`}>
              {block.exitCode === 0 ? '✓' : `exit ${block.exitCode}`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); handleCopy() }} className="p-1 hover:bg-slate-700 rounded">
            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-slate-400" />}
          </button>
          {expanded ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
        </div>
      </div>
      {expanded && (
        <div className="p-3 font-mono text-xs max-h-48 overflow-y-auto bg-slate-950/50">
          {block.outputs.map((output, idx) => (
            <div key={idx} className={`whitespace-pre-wrap break-all ${output.type === 'stderr' ? 'text-red-400' : 'text-green-400'}`}>
              {output.content}
            </div>
          ))}
          {block.isRunning && <div className="w-2 h-3 bg-green-400 animate-pulse mt-1" />}
        </div>
      )}
    </div>
  )
}

export default function CommandCenter() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Welcome to the AI Command Center! Ask me anything about your server status, Docker containers, disk usage, or Coolify services.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const [showModelPicker, setShowModelPicker] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting')
  const [coolifyStatus, setCoolifyStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const checkConnections = useCallback(async () => {
    try {
      const [statusRes, coolifyRes] = await Promise.all([
        fetch('/api/status').catch(() => null),
        fetch('/api/coolify/health').catch(() => null)
      ])
      setConnectionStatus(statusRes?.ok ? 'connected' : 'disconnected')
      setCoolifyStatus(coolifyRes?.ok ? 'connected' : 'disconnected')
    } catch {
      setConnectionStatus('disconnected')
    }
  }, [])

  useEffect(() => {
    checkConnections()
    const interval = setInterval(checkConnections, 15000)
    return () => clearInterval(interval)
  }, [checkConnections])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const parseCommandsFromResponse = (text: string): { cleanText: string; commands: CommandBlock[] } => {
    const commandPattern = /```(?:bash|shell|sh)?\n?([\s\S]*?)```/g
    const commands: CommandBlock[] = []
    let match
    while ((match = commandPattern.exec(text)) !== null) {
      const cmdContent = match[1].trim()
      if (cmdContent) {
        const lines = cmdContent.split('\n')
        const cmd = lines[0].replace(/^\$\s*/, '')
        const output = lines.slice(1).join('\n')
        commands.push({
          command: cmd,
          outputs: output ? [{ type: 'stdout', content: output }] : [],
          exitCode: 0,
          isRunning: false
        })
      }
    }
    return { cleanText: text.replace(commandPattern, '').trim(), commands }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    const assistantId = (Date.now() + 1).toString()
    
    setMessages(prev => [...prev, userMessage, {
      id: assistantId,
      role: 'assistant',
      content: '',
      isStreaming: true,
      timestamp: new Date()
    }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          model: selectedModel,
          agent: 'build'
        })
      })

      const data = await response.json()
      const responseText = data.response || 'I received your message but couldn\'t generate a response.'
      const reasoning = data.reasoning || ''
      const { cleanText, commands } = parseCommandsFromResponse(responseText)

      // Simulate streaming effect
      const fullText = cleanText || responseText
      let streamedText = ''
      const words = fullText.split(' ')
      
      for (let i = 0; i < words.length; i++) {
        streamedText += (i > 0 ? ' ' : '') + words[i]
        const currentText = streamedText
        setMessages(prev => prev.map(m => 
          m.id === assistantId 
            ? { ...m, content: currentText, isStreaming: i < words.length - 1 }
            : m
        ))
        await new Promise(r => setTimeout(r, 20)) // 20ms per word
      }

      // Final update with commands and reasoning
      setMessages(prev => prev.map(m => 
        m.id === assistantId 
          ? { ...m, content: fullText, commands: commands.length > 0 ? commands : undefined, reasoning, isStreaming: false }
          : m
      ))
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => prev.map(m => 
        m.id === assistantId 
          ? { ...m, content: '❌ Error communicating with the server. Please try again.', isStreaming: false }
          : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { label: 'Containers', icon: Container, prompt: 'Show all running Docker containers with their status' },
    { label: 'Disk', icon: HardDrive, prompt: 'Show disk usage and available space' },
    { label: 'Resources', icon: Activity, prompt: 'Show CPU, memory usage and system load' },
    { label: 'Services', icon: Server, prompt: 'List all Coolify services and their current status' },
  ]

  const formatTime = (ts: Date | string) => {
    const d = typeof ts === 'string' ? new Date(ts) : ts
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Bot className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">AI Command Center</h1>
              <p className="text-xs text-slate-400">Server management assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Model Picker */}
            <div className="relative">
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <span className="text-sm">{currentModel.icon}</span>
                <span className="text-xs text-slate-300">{currentModel.name}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              
              {showModelPicker && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-800 border border-slate-700 shadow-xl z-50 overflow-hidden">
                  {MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model.id); setShowModelPicker(false) }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-700 transition-colors ${
                        selectedModel === model.id ? 'bg-slate-700/50' : ''
                      }`}
                    >
                      <span>{model.icon}</span>
                      <span className="text-sm text-slate-200">{model.name}</span>
                      {selectedModel === model.id && <Check className="h-3 w-3 text-green-400 ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Badge 
              variant="secondary" 
              className={`text-xs ${connectionStatus === 'connected' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
              OpenCode
            </Badge>
            
            <Badge 
              variant="secondary" 
              className={`text-xs ${coolifyStatus === 'connected' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${coolifyStatus === 'connected' ? 'bg-green-400' : 'bg-slate-400'}`} />
              Coolify
            </Badge>

            <Button variant="ghost" size="sm" onClick={checkConnections} className="text-slate-400 hover:text-white">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-400" />
                  </div>
                )}

                <div className={`max-w-[75%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-2xl px-4 py-2.5 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-slate-800/80 text-slate-200 rounded-bl-sm border border-slate-700/50'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                      {message.isStreaming && <span className="inline-block w-1.5 h-4 bg-blue-400 ml-1 animate-pulse" />}
                    </p>
                  </div>
                  
                  {/* Reasoning Widget */}
                  {message.role === 'assistant' && message.reasoning && (
                    <ReasoningWidget reasoning={message.reasoning} />
                  )}
                  
                  {/* Terminal blocks */}
                  {message.commands?.map((cmd, idx) => (
                    <TerminalBox key={idx} block={cmd} />
                  ))}
                  
                  <p className="text-[10px] text-slate-500 mt-1 px-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pb-3 overflow-x-auto">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                onClick={() => setInput(action.prompt)}
                className="flex-shrink-0 border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-xs"
              >
                <action.icon className="h-3.5 w-3.5 mr-1.5" />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 pt-2 border-t border-slate-700/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about server status, containers, logs..."
              className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
