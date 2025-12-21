import { NextResponse } from 'next/server'
import { getOpencodeClient, getOpencodeMode } from '@/lib/opencode'

export async function GET() {
  try {
    const { client, serverUrl } = await getOpencodeClient()
    const mode = getOpencodeMode()

    // Test connection by fetching config
    const config = await client.config.get()

    return NextResponse.json({
      connected: true,
      serverUrl,
      mode,
      config: config.data,
      status: mode === 'client' ? 'client_connected' : 'embedded_running'
    })
  } catch (error) {
    console.error('OpenCode status check failed:', error)
    return NextResponse.json({
      connected: false,
      mode: getOpencodeMode(),
      status: 'connection_failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
