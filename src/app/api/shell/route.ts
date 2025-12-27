import { NextResponse } from 'next/server'
import { getOpencodeClient } from '@/lib/opencode'

export async function POST(request: Request) {
  try {
    const { command, agent = 'build' } = await request.json()

    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 })
    }

    const { client } = await getOpencodeClient()

    // Use OpenCode's shell API to run commands on the VPS
    const result = await client.session.shell({
      path: { id: 'global' },
      body: {
        agent,
        command
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any

    const response = result?.response?.data || result?.data || result

    return NextResponse.json({
      success: true,
      output: response,
      command
    })

  } catch (error) {
    console.error('Shell API error:', error)
    return NextResponse.json({ 
      error: 'Failed to execute command',
      details: (error as Error).message 
    }, { status: 500 })
  }
}
