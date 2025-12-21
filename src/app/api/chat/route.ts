import { createOpencode } from '@opencode-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

interface OpencodeInstance {
  server: { url: string }
  client: {
    session: {
      create(body: { title: string }): Promise<{ id?: string }>
      prompt(body: {
        path: { id: string }
        body: {
          model: { providerID: string; modelID: string }
          parts: Array<{ type: string; text: string }>
        }
      }): Promise<{ parts?: Array<{ type: string; text: string }> }>
    }
  }
}

let opencodeInstance: OpencodeInstance | null = null
let currentSession: { id?: string; fallback?: boolean } | null = null

async function getOpencodeInstance(): Promise<OpencodeInstance> {
  if (!opencodeInstance) {
    try {
      console.log('🚀 Starting embedded OpenCode server for chat...')
      opencodeInstance = await createOpencode({
        hostname: '0.0.0.0',
        port: 4097,
        timeout: 15000,
        config: {
          model: process.env.DEFAULT_MODEL || 'anthropic/claude-3-5-sonnet-20241022'
        }
      }) as OpencodeInstance
      console.log(`✅ OpenCode server started for chat at ${opencodeInstance.server.url}`)
    } catch (error) {
      console.error('❌ Failed to start OpenCode server for chat:', error)
      throw error
    }
  }
  return opencodeInstance
}

async function getSession(client: OpencodeInstance['client']): Promise<{ id?: string; fallback?: boolean }> {
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
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const opencode = await getOpencodeInstance()
    const client = opencode.client

    // Try to get/create a session
    let session
    try {
      session = await getSession(client)
    } catch (_sessionError) {
      console.log('Session creation failed, using direct prompt')
    }

    let result: { parts?: Array<{ type: string; text: string }> }
    try {
      if (session && session.id && !session.fallback) {
        // Use session-based prompt
        console.log('📤 Sending session-based prompt...')
        result = await client.session.prompt({
          path: { id: session.id },
          body: {
            model: { providerID: 'opencode', modelID: 'grok-code' },
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
      ?.filter((part: { type: string; text: string }) => part.type === 'text')
      ?.map((part: { type: string; text: string }) => part.text)
      ?.join('') || 'I received your message but couldn\'t generate a response.'

    return NextResponse.json({
      response: assistantContent,
      sessionId: session?.id || 'embedded-session',
      serverUrl: opencode.server.url,
      mode: session?.fallback ? 'embedded_fallback' : 'embedded_session'
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
