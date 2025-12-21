import { NextResponse } from 'next/server'
import { getOpencodeClient, getOpencodeMode } from '@/lib/opencode'

export async function GET() {
  try {
    const { client, serverUrl } = await getOpencodeClient()
    const mode = getOpencodeMode()

    // Test connection by fetching config
    // SDK returns { error?, request, response } format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const configResponse = await client.config.get() as any
    
    // Config errors are OK - server is still running
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const configData = configResponse?.response?.data || configResponse?.data || configResponse

    return NextResponse.json({
      connected: true,
      serverUrl,
      mode,
      config: configData,
      status: mode === 'client' ? 'client_connected' : 'embedded_running',
      hasConfigError: !!configResponse?.error
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
