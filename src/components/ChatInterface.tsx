'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date | string
}

// Available models for selection - OpenCode Zen models first!
const AVAILABLE_MODELS = [
  // 🆓 FREE OpenCode Zen Models
  { id: 'opencode/grok-code-fast-1', name: '⚡ Grok Code Fast 1', provider: 'OpenCode Zen (FREE)', free: true },
  { id: 'opencode/big-pickle', name: '🥒 Big Pickle', provider: 'OpenCode Zen (FREE)', free: true },
  { id: 'opencode/gpt-5-nano', name: '🔬 GPT-5 Nano', provider: 'OpenCode Zen (FREE)', free: true },
  
  // xAI Grok Models
  { id: 'xai/grok-2', name: 'Grok 2', provider: 'xAI', free: false },
  { id: 'xai/grok-2-mini', name: 'Grok 2 Mini', provider: 'xAI', free: false },
  
  // Anthropic Claude Models
  { id: 'anthropic/claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', free: false },
  { id: 'anthropic/claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic', free: false },
  
  // OpenAI Models
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', free: false },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', free: false },
  
  // Google Models
  { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google', free: false },
]

export function ChatInterface() {
  const formatTimestamp = (timestamp: Date | string) => {
    const dateObj = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Unknown time'
    }
    return dateObj.toLocaleTimeString()
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI coding assistant powered by OpenCode. I can help you with coding tasks, debugging, project management, and more. What would you like to work on?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState('opencode/grok-code-fast-1')
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'ping' })
        })
        setIsConnected(response.ok)
      } catch {
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Send message via API route with selected model
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, model: selectedModel })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I received your message but couldn\'t generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Error communicating with OpenCode server. Please check the connection and try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Bot className="h-5 w-5 text-blue-400" />
            AI Assistant Chat
            <Badge variant="secondary" className={isConnected ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </CardTitle>
          
          {/* Model Selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 min-w-[180px] justify-between"
              onClick={() => setShowModelDropdown(!showModelDropdown)}
            >
              <span className="truncate">
                {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || 'Select Model'}
              </span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            
            {showModelDropdown && (
              <div className="absolute right-0 mt-1 w-72 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg ${
                      selectedModel === model.id ? 'bg-slate-700 text-blue-400' : 'text-slate-300'
                    }`}
                    onClick={() => {
                      setSelectedModel(model.id)
                      setShowModelDropdown(false)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{model.name}</span>
                      {model.free && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">FREE</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{model.provider}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="bg-slate-700 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span className="text-sm text-slate-200">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about coding, debugging, or project management..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="text-xs text-slate-400 text-center">
          {isConnected ? (
            <>🟢 Connected to OpenCode server • Session: {sessionId?.slice(-8) || 'active'} • Using grok-code model</>
          ) : (
            <>🔴 Connecting to OpenCode server...</>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
