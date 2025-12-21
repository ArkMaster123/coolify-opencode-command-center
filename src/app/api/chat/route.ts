import { NextRequest, NextResponse } from 'next/server'
import { getOpencodeClient, getOpencodeMode } from '@/lib/opencode'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentSession: any = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSession(client: any) {
  if (!currentSession) {
    try {
      const response = await client.session.create({
        body: { title: 'AI Command Center Chat' }
      })
      
      // SDK might return { data: Session } or just Session
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionData = (response as any)?.data || response
      
      console.log('🔍 Session creation response type:', typeof sessionData)
      console.log('🔍 Session data keys:', sessionData ? Object.keys(sessionData).join(', ') : 'null')
      if (sessionData?.id) console.log('🔍 Session ID found:', sessionData.id)
      
      if (sessionData && sessionData.id) {
        currentSession = sessionData
        console.log('✅ Chat session created:', currentSession.id)
      } else {
        // Try to use first existing session as fallback
        try {
          const sessions = await client.session.list()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sessionsList = Array.isArray(sessions) ? sessions : (sessions as any)?.data || []
          if (sessionsList.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const firstSession = sessionsList[0] as any
            if (firstSession.id) {
              currentSession = firstSession
              console.log('✅ Using existing session:', currentSession.id)
            } else {
              console.log('⚠️ Session created but no ID found, response:', response)
              currentSession = { id: 'fallback-session', fallback: true }
            }
          } else {
            console.log('⚠️ No sessions available, using fallback')
            currentSession = { id: 'fallback-session', fallback: true }
          }
        } catch (listError) {
          console.log('⚠️ Could not list sessions:', (listError as Error).message)
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
        
        const promptResponse = await client.session.prompt({
          path: { id: session.id },
          body: {
            model: { providerID, modelID },
            parts: [{ type: 'text', text: message }]
          }
        })
        
        // SDK might return { data: Message } or just Message
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result = (promptResponse as any)?.data || promptResponse
        
        console.log('✅ Session prompt successful, response type:', typeof result)
        console.log('📝 Response has parts:', !!result?.parts)
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

    const assistantContent = result.parts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.filter((part: any) => part.type === 'text')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.map((part: any) => part.text)
      ?.join('') || 'I received your message but couldn\'t generate a response.'

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
