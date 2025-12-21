import { NextRequest, NextResponse } from 'next/server'
import { getOpencodeClient } from '@/lib/opencode'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentSession: any = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSession(client: any) {
  if (!currentSession) {
    try {
      currentSession = await client.session.create({
        body: { title: 'AI Command Center Chat' }
      })
      console.log('✅ Chat session created:', currentSession?.id)
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
    } catch {
      console.log('Session creation failed, using direct prompt')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any
    try {
      if (session && session.id && !session.fallback) {
        // Use session-based prompt
        console.log('📤 Sending session-based prompt...')
        // Use user-selected model or default to FREE grok-code-fast-1
        const defaultModel = process.env.DEFAULT_MODEL || 'opencode/grok-code-fast-1'
        const modelConfig = userModel || defaultModel
        const [providerID, modelID] = modelConfig.split('/')
        
        console.log(`🤖 Using model: ${providerID}/${modelID}`)
        
        result = await client.session.prompt({
          path: { id: session.id },
          body: {
            model: { providerID, modelID },
            parts: [{ type: 'text', text: message }]
          }
        })
        console.log('✅ Session prompt successful')
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
    console.error('❌ Chat API error:', error)
    return NextResponse.json({
      error: 'Failed to communicate with embedded OpenCode server',
      response: '❌ Error with embedded OpenCode server. The server may still be starting up.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
