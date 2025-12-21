import { NextRequest, NextResponse } from 'next/server'
import { getOpencodeClient, getOpencodeMode } from '@/lib/opencode'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentSession: any = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSession(client: any) {
  if (!currentSession) {
    try {
      // According to SDK docs: session.create() returns Session directly
      // With responseStyle='data', we get Session directly (no wrapping)
      const sessionData = await client.session.create({
        body: { title: 'AI Command Center Chat' }
      })
      
      console.log('🔍 Session response keys:', sessionData ? Object.keys(sessionData).join(', ') : 'null')
      console.log('🔍 Session ID:', sessionData?.id)
      
      if (sessionData?.id) {
        currentSession = sessionData
        console.log('✅ Chat session created:', currentSession.id)
      } else {
        // Fallback: try to use existing session
        try {
          const sessionsResponse = await client.session.list()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sessions = Array.isArray(sessionsResponse) ? sessionsResponse : (sessionsResponse as any)?.data || []
          if (sessions.length > 0 && sessions[0]?.id) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            currentSession = sessions[0] as any
            console.log('✅ Using existing session:', currentSession.id)
          } else {
            console.log('⚠️ No valid session found, using fallback')
            currentSession = { id: 'fallback-session', fallback: true }
          }
        } catch {
          console.log('⚠️ Could not list sessions, using fallback')
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
    const { message, model: userModel } = await request.json()

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
        // Use user-selected model or default to FREE grok-code-fast-1
        const defaultModel = process.env.DEFAULT_MODEL || 'opencode/grok-code-fast-1'
        const modelConfig = userModel || defaultModel
        const [providerID, modelID] = modelConfig.split('/')
        
        console.log(`🤖 Using model: ${providerID}/${modelID}`)
        
        // According to SDK docs: session.prompt() returns AssistantMessage (Message type)
        // With responseStyle='data', we get AssistantMessage directly
        // AssistantMessage has parts directly on it
        const assistantMessage = await client.session.prompt({
          path: { id: session.id },
          body: {
            model: { providerID, modelID },
            parts: [{ type: 'text', text: message }]
          }
        })
        
        // AssistantMessage (Message type) has parts directly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result = { parts: (assistantMessage as any)?.parts || [] }
        
        console.log('✅ Session prompt successful')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parts = (assistantMessage as any)?.parts || []
        console.log('📝 Response:', { 
          hasParts: !!parts, 
          partsCount: Array.isArray(parts) ? parts.length : 0,
          messageKeys: assistantMessage ? Object.keys(assistantMessage).join(', ') : 'null'
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

    // Extract text content from parts array
    const parts = result?.parts || []
    const assistantContent = Array.isArray(parts)
      ? parts
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((part: any) => part && part.type === 'text')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((part: any) => part.text || '')
          .join('')
      : 'I received your message but couldn\'t generate a response.'
    
    console.log('📤 Extracted content length:', assistantContent.length)

    return NextResponse.json({
      response: assistantContent,
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
