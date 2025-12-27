import { NextRequest, NextResponse } from 'next/server'
import { getOpencodeClient, getOpencodeMode } from '@/lib/opencode'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentSession: any = null
let sessionCreatedAt: number = 0
const SESSION_MAX_AGE_MS = 5 * 60 * 1000 // 5 minutes

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSession(client: any) {
  // Reuse session if still fresh
  const sessionAge = Date.now() - sessionCreatedAt
  if (currentSession && !currentSession.fallback && sessionAge < SESSION_MAX_AGE_MS) {
    return currentSession
  }
  
  // Reset if session is stale
  if (sessionAge >= SESSION_MAX_AGE_MS) {
    console.log('🔄 Session expired, creating new one...')
    currentSession = null
  }
  
  if (!currentSession) {
    sessionCreatedAt = Date.now()
    try {
      // SDK with responseStyle='fields' returns { error?, request, response }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionResponse = await client.session.create({
        body: { title: 'AI Command Center Chat' }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
      
      // Check for errors first
      if (sessionResponse?.error) {
        console.log('⚠️ Session creation error:', sessionResponse.error.name)
        // Config errors shouldn't prevent session creation - try listing existing sessions
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const listResponse = await client.session.list() as any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sessions = Array.isArray(listResponse?.response?.data) 
            ? listResponse.response.data 
            : Array.isArray(listResponse?.data) 
              ? listResponse.data 
              : Array.isArray(listResponse) 
                ? listResponse 
                : []
          if (sessions.length > 0 && sessions[0]?.id) {
            currentSession = sessions[0]
            console.log('✅ Using existing session:', currentSession.id)
          } else {
            throw new Error('No sessions available')
          }
        } catch {
          console.log('⚠️ Could not get sessions, using fallback')
          currentSession = { id: 'fallback-session', fallback: true }
        }
      } else {
        // Extract session from response.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sessionData = sessionResponse?.response?.data || sessionResponse?.data || sessionResponse
        if (sessionData?.id) {
          currentSession = sessionData
          console.log('✅ Chat session created:', currentSession.id)
        } else {
          console.log('⚠️ No session ID in response')
          currentSession = { id: 'fallback-session', fallback: true }
        }
      }
    } catch (error) {
      console.log('⚠️ Session creation failed, using fallback mode:', (error as Error).message)
      currentSession = { id: 'fallback-session', fallback: true }
    }
  }
  return currentSession
}

export async function POST(request: NextRequest) {
  try {
    const { message, model: userModel, agent: userAgent } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const { client, serverUrl } = await getOpencodeClient()

    // Try to get/create a session
    let session
    try {
      session = await getSession(client)
      console.log('📋 Session state:', { 
        hasSession: !!session, 
        sessionId: session?.id, 
        isFallback: session?.fallback 
      })
    } catch (err) {
      console.log('Session creation failed, using direct prompt:', (err as Error).message)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any
    try {
      // Check if we have a valid session with an ID
      const hasValidSession = session && session.id && session.id !== 'fallback-session' && !session.fallback
      
      if (hasValidSession) {
        // Use session-based prompt
        console.log('📤 Sending session-based prompt...')
        const defaultModel = process.env.DEFAULT_MODEL || 'opencode/grok-code'
        const modelConfig = userModel || defaultModel
        const [providerID, modelID] = modelConfig.split('/')
        
        const selectedAgent = userAgent || 'build'
        console.log(`🤖 Using model: ${providerID}/${modelID}, agent: ${selectedAgent}`)
        
        // SDK returns { error?, request, response } format
        // Prompt is async - sends message and returns immediately
        const promptResponse = await client.session.prompt({
          path: { id: session.id },
          body: {
            model: { providerID, modelID },
            agent: selectedAgent,
            parts: [{ type: 'text', text: message }]
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
        
        if (promptResponse?.error) {
          throw new Error(`Prompt failed: ${promptResponse.error.name} - ${promptResponse.error.message || 'Unknown error'}`)
        }
        
        // Poll for response - shorter initial wait, faster polling
        console.log('⏳ Waiting for AI response...')
        await new Promise(resolve => setTimeout(resolve, 500)) // 500ms initial wait
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let parts: any[] = []
        const startTime = Date.now()
        const maxWaitMs = 30000 // 30 second max wait
        let attempt = 0
        
        while (Date.now() - startTime < maxWaitMs) {
          attempt++
          const messagesResponse = await client.session.messages({ path: { id: session.id } })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const messages = (messagesResponse as any)?.response?.data || (messagesResponse as any)?.data || messagesResponse
          
          if (Array.isArray(messages)) {
            // Find the LAST assistant message (most recent response)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const assistantMessages = messages.filter((m: any) => {
              const role = m.info?.role || m.info?.type
              return role === 'assistant'
            })
            const assistantMsg = assistantMessages.length > 0 ? assistantMessages[assistantMessages.length - 1] : null
            
            if (assistantMsg?.parts && assistantMsg.parts.length > 0) {
              // Check if response has actual text content (not just empty)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const hasText = assistantMsg.parts.some((p: any) => p.type === 'text' && p.text?.length > 0)
              if (hasText) {
                parts = assistantMsg.parts
                console.log(`✅ Got AI response after ${attempt} polls (${Date.now() - startTime}ms)`)
                break
              }
            }
          }
          
          // Exponential backoff: 300ms, 400ms, 500ms... up to 1000ms
          const delay = Math.min(300 + (attempt * 100), 1000)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
        
        if (parts.length === 0) {
          console.log(`⚠️ Timeout after ${Date.now() - startTime}ms`)
        }
        
        result = { parts }
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const partsPreview = parts.slice(0, 2).map((p: any) => ({ type: p.type, text: p.text?.substring(0, 50) }))
        console.log('📝 Final result:', { 
          hasParts: parts.length > 0, 
          partsCount: parts.length,
          partsPreview
        })
      } else {
        // Fallback: try direct prompt or simulated response
        console.log('⚠️ Using fallback chat mode')
        result = {
          parts: [{
            type: 'text',
            text: `Hello! I received your message: "${message}". The OpenCode server is running in embedded mode. This is a fallback response while we establish full AI integration.`
          }]
        }
      }
    } catch (promptError) {
      console.error('❌ Prompt failed:', promptError)
      result = {
        parts: [{
          type: 'text',
          text: `I received your message: "${message}". The AI service encountered an issue, but the embedded OpenCode server is running.`
        }]
      }
    }

    // Extract text content and reasoning from parts array
    const parts = result?.parts || []
    let assistantContent = ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let reasoningParts: any[] = []
    
    if (Array.isArray(parts) && parts.length > 0) {
      // Extract reasoning parts (type='reasoning')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reasoningParts = parts.filter((part: any) => part && part.type === 'reasoning' && part.text)
      
      // First, try to get text from parts with type='text'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textParts = parts.filter((part: any) => part && part.type === 'text' && part.text)
      if (textParts.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        assistantContent = textParts.map((part: any) => part.text).join('')
        console.log('✅ Extracted from text parts:', textParts.length)
      } else {
        // Fallback: look for any part with a text field (excluding reasoning)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const partsWithText = parts.filter((part: any) => part && part.text && part.type !== 'reasoning')
        if (partsWithText.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          assistantContent = partsWithText.map((part: any) => part.text).join(' ')
          console.log('✅ Extracted from parts with text field:', partsWithText.length)
        } else {
          assistantContent = 'I received your message but couldn\'t generate a response.'
          console.log('⚠️ No text found in parts')
        }
      }
    } else {
      assistantContent = 'I received your message but couldn\'t generate a response.'
      console.log('⚠️ No parts array found')
    }
    
    console.log('📤 Extracted content:', assistantContent.substring(0, 100))
    console.log('🧠 Reasoning parts:', reasoningParts.length)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reasoningText = reasoningParts.map((p: any) => p.text).join('\n\n')
    
    return NextResponse.json({
      response: assistantContent,
      reasoning: reasoningText,
      hasReasoning: reasoningParts.length > 0,
      sessionId: session?.id || 'opencode-session',
      serverUrl,
      mode: session?.fallback ? 'fallback' : 'session'
    })

  } catch (error) {
    const mode = getOpencodeMode()
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`❌ Chat API error (${mode} mode):`, errorMsg)
    
    let userMessage = '❌ Error communicating with OpenCode server.'
    if (mode === 'client') {
      userMessage = '❌ Error connecting to local OpenCode server. Make sure it\'s running:\n`opencode serve --hostname 127.0.0.1 --port 4096`'
    } else {
      userMessage = '❌ Error with embedded OpenCode server. The server may still be starting up.'
    }
    
    return NextResponse.json({
      error: `Failed to communicate with OpenCode server (${mode} mode)`,
      response: userMessage,
      mode,
      details: errorMsg
    }, { status: 500 })
  }
}
