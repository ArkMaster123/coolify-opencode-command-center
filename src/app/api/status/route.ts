import { createOpencodeClient } from '@opencode-ai/sdk'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const serverUrl = process.env.OPEN_CODE_SERVER_URL || 'http://142.132.171.59:4096'
    const client = createOpencodeClient({
      baseUrl: serverUrl
    })

    // Test connection by fetching config
    await client.config.get()

    return NextResponse.json({ connected: true })
  } catch (error) {
    console.error('OpenCode connection check failed:', error)
    return NextResponse.json({ connected: false })
  }
}
