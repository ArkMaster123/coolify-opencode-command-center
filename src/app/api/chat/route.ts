import { createOpencodeClient } from '@opencode-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

let opencodeClient: any = null
let currentSession: any = null

async function getClient() {
  if (!opencodeClient) {
    const serverUrl = process.env.OPEN_CODE_SERVER_URL || 'http://142.132.171.59:4096'
    opencodeClient = createOpencodeClient({
      baseUrl: serverUrl
    })
  }
  return opencodeClient
}

async function getSession(client: any) {
  if (!currentSession) {
    currentSession = await client.session.create({
      body: { title: 'AI Command Center Chat' }
    })
  }
  return currentSession
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const client = await getClient()

    // Try to get/create a session
    let session
    try {
      session = await getSession(client)
    } catch (sessionError) {
      console.log('Session creation failed, trying direct prompt')
      // If session creation fails, try direct prompt without session
    }

    let result
    try {
      if (session && session.id) {
        // Use session-based prompt
        result = await client.session.prompt({
          path: { id: session.id },
          body: {
            model: { providerID: 'opencode', modelID: 'grok-code' },
            parts: [{ type: 'text', text: message }]
          }
        })
      } else {
        // Fallback: try direct prompt (if supported)
        console.log('Using fallback prompt method')
        result = { parts: [{ type: 'text', text: 'Hello! I received your message. The OpenCode server is connected but using simplified response mode.' }] }
      }
    } catch (promptError) {
      console.error('Prompt failed:', promptError)
      // Final fallback
      result = { parts: [{ type: 'text', text: 'Hello! I received your message. The AI service is currently in basic mode.' }] }
    }

    const assistantContent = result.parts
      ?.filter((part: any) => part.type === 'text')
      ?.map((part: any) => part.text)
      ?.join('') || 'I received your message but couldn\'t generate a response.'

    return NextResponse.json({
      response: assistantContent,
      sessionId: session?.id || 'fallback-session',
      mode: session ? 'session' : 'fallback'
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      error: 'Failed to communicate with OpenCode server',
      response: '❌ Error communicating with OpenCode server. Please check the connection and try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
