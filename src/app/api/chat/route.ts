import { createOpencodeClient } from '@opencode-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

let opencodeClient: any = null
let currentSession: any = null

async function getClient() {
  if (!opencodeClient) {
    opencodeClient = createOpencodeClient({
      baseUrl: 'http://142.132.171.59:4096'
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
    const session = await getSession(client)

    const result = await client.session.prompt({
      path: { id: session.id },
      body: {
        model: { providerID: 'opencode', modelID: 'grok-code' },
        parts: [{ type: 'text', text: message }]
      }
    })

    const assistantContent = result.parts
      ?.filter((part: any) => part.type === 'text')
      ?.map((part: any) => part.text)
      ?.join('') || 'I received your message but couldn\'t generate a response.'

    return NextResponse.json({
      response: assistantContent,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      error: 'Failed to communicate with OpenCode server',
      response: '❌ Error communicating with OpenCode server. Please check the connection and try again.'
    }, { status: 500 })
  }
}
