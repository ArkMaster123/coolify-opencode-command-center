import { NextResponse } from 'next/server'
import { getOpencodeClient } from '@/lib/opencode'

// Abort a running session
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { action } = await request.json()

    const { client } = await getOpencodeClient()

    if (action === 'abort') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await client.session.abort({ path: { id } }) as any
      return NextResponse.json({ success: true, action: 'aborted' })
    }

    if (action === 'summarize') {
      await client.session.summarize({ 
        path: { id },
        body: { providerID: 'opencode', modelID: 'grok-code-fast-1' }
      })
      return NextResponse.json({ success: true, action: 'summarized' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Session action error:', error)
    return NextResponse.json({ error: 'Failed to perform action' }, { status: 500 })
  }
}

// Get session details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { client } = await getOpencodeClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await client.session.get({ path: { id } }) as any
    const session = result?.response?.data || result?.data || result

    // Also get messages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messagesResult = await client.session.messages({ path: { id } }) as any
    const messages = messagesResult?.response?.data || messagesResult?.data || messagesResult || []

    return NextResponse.json({ session, messages })

  } catch (error) {
    console.error('Session get error:', error)
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
}

// Delete session
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { client } = await getOpencodeClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await client.session.delete({ path: { id } }) as any

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Session delete error:', error)
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 })
  }
}
