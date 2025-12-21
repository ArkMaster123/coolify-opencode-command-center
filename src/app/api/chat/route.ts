import { NextRequest, NextResponse } from 'next/server'
import { getOpencodeClient, getOpencodeMode } from '@/lib/opencode'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentSession: any = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSession(client: any) {
  if (!currentSession) {
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
        // Use user-selected model or default to FREE grok-code (not grok-code-fast-1!)
        const defaultModel = process.env.DEFAULT_MODEL || 'opencode/grok-code'
        const modelConfig = userModel || defaultModel
        const [providerID, modelID] = modelConfig.split('/')
        
        // Fix model name: grok-code-fast-1 -> grok-code
        const actualModelID = modelID === 'grok-code-fast-1' ? 'grok-code' : modelID
        
        console.log(`🤖 Using model: ${providerID}/${actualModelID}`)
        
        // SDK returns { error?, request, response } format
        // Prompt is async - sends message and returns immediately
        const promptResponse = await client.session.prompt({
          path: { id: session.id },
          body: {
            model: { providerID, modelID: actualModelID },
            parts: [{ type: 'text', text: message }]
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
        
        if (promptResponse?.error) {
          throw new Error(`Prompt failed: ${promptResponse.error.name} - ${promptResponse.error.message || 'Unknown error'}`)
        }
        
        // Prompt is async - wait for AI response, then check messages
        console.log('⏳ Waiting for AI response...')
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
        
        // Poll for response (up to 8 seconds total)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let parts: any[] = []
        for (let attempt = 0; attempt < 6; attempt++) {
          const messagesResponse = await client.session.messages({ path: { id: session.id } })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const messages = (messagesResponse as any)?.response?.data || (messagesResponse as any)?.data || messagesResponse
          
          if (Array.isArray(messages)) {
            // Find the assistant message (should be the last one)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const assistantMsg = messages.find((m: any) => m.info?.role === 'assistant' || m.info?.type === 'assistant')
            if (assistantMsg?.parts && assistantMsg.parts.length > 0) {
              parts = assistantMsg.parts
              console.log(`✅ Got AI response after ${attempt + 1} attempts`)
              break
            }
          }
          
          if (attempt < 5) {
            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 more second
          }
        }
        
        result = { parts }
        
        console.log('📝 Response:', { 
          hasParts: parts.length > 0, 
          partsCount: parts.length
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
