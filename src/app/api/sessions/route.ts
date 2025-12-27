import { NextResponse } from 'next/server'
import { getOpencodeClient } from '@/lib/opencode'

// List all sessions
export async function GET() {
  try {
    const { client } = await getOpencodeClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await client.session.list() as any
    const sessions = result?.response?.data || result?.data || result || []

    return NextResponse.json(sessions)

  } catch (error) {
    console.error('Sessions API error:', error)
    return NextResponse.json({ error: 'Failed to list sessions' }, { status: 500 })
  }
}

// Create a new session
export async function POST(request: Request) {
  try {
    const { title } = await request.json()

    const { client } = await getOpencodeClient()

    const result = await client.session.create({
      body: { title: title || 'New Session' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any

    const session = result?.response?.data || result?.data || result

    return NextResponse.json(session)

  } catch (error) {
    console.error('Session create error:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

// Delete a session
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const { client } = await getOpencodeClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await client.session.delete({ path: { id } }) as any

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Session delete error:', error)
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 })
  }
}
