import { createOpencode } from '@opencode-ai/sdk'
import { NextResponse } from 'next/server'

interface OpencodeInstance {
  server: { url: string }
  client: {
    config: {
      get(): Promise<{ data: unknown }>
    }
  }
}

let opencodeInstance: OpencodeInstance | null = null

async function getOpencodeInstance(): Promise<OpencodeInstance> {
  if (!opencodeInstance) {
    try {
      console.log('🚀 Starting embedded OpenCode server...')
      opencodeInstance = await createOpencode({
        hostname: '0.0.0.0',
        port: 4097,
        timeout: 15000,
        config: {
          model: process.env.DEFAULT_MODEL || 'anthropic/claude-3-5-sonnet-20241022'
        }
      }) as OpencodeInstance
      console.log(`✅ OpenCode server started at ${opencodeInstance.server.url}`)
    } catch (error) {
      console.error('❌ Failed to start OpenCode server:', error)
      throw error
    }
  }
  return opencodeInstance
}

export async function GET() {
  try {
    const opencode = await getOpencodeInstance()

    // Test connection by fetching config
    const config = await opencode.client.config.get()

    return NextResponse.json({
      connected: true,
      serverUrl: opencode.server.url,
      config: config.data,
      status: 'embedded_running'
    })
  } catch (error) {
    console.error('OpenCode status check failed:', error)
    return NextResponse.json({
      connected: false,
      status: 'embedded_failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
