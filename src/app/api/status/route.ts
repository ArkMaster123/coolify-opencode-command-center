import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const serverUrl = process.env.OPEN_CODE_SERVER_URL || 'http://142.132.171.59:4096'

    // Simple health check - just verify the URL is configured
    const response = await fetch(`${serverUrl}/config`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })

    if (response.ok) {
      return NextResponse.json({
        connected: true,
        server: serverUrl,
        status: 'healthy'
      })
    } else {
      return NextResponse.json({
        connected: false,
        server: serverUrl,
        status: 'server_error',
        code: response.status
      })
    }
  } catch (error) {
    console.error('OpenCode connection check failed:', error)
    return NextResponse.json({
      connected: false,
      server: process.env.OPEN_CODE_SERVER_URL || 'http://142.132.171.59:4096',
      status: 'connection_failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
