import { createOpencode, createOpencodeClient } from '@opencode-ai/sdk'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let opencodeInstance: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let opencodeClient: any = null

/**
 * Get OpenCode client - works in both modes:
 * - CLIENT mode: Connects to existing opencode server (for local dev)
 * - EMBEDDED mode: Starts embedded server (for production/Coolify)
 */
export async function getOpencodeClient() {
  const mode = process.env.OPENCODE_MODE || 'embedded'
  const serverUrl = process.env.OPENCODE_SERVER_URL || 'http://127.0.0.1:4096'

  if (mode === 'client') {
    // CLIENT MODE: Connect to existing server
    if (!opencodeClient) {
      console.log(`🔌 CLIENT MODE: Connecting to OpenCode server at ${serverUrl}...`)
      opencodeClient = createOpencodeClient({
        baseUrl: serverUrl
      })
      
      // Test connection
      try {
        await opencodeClient.config.get()
        console.log(`✅ Connected to OpenCode server at ${serverUrl}`)
      } catch (error) {
        console.error(`❌ Failed to connect to OpenCode server at ${serverUrl}`)
        console.error(`   Make sure OpenCode server is running:`)
        console.error(`   opencode serve --hostname 127.0.0.1 --port 4096`)
        throw new Error(`Cannot connect to OpenCode server at ${serverUrl}. Is it running?`)
      }
    }
    return { client: opencodeClient, serverUrl }
  } else {
    // EMBEDDED MODE: Start embedded server
    if (!opencodeInstance) {
      try {
        console.log('🚀 Starting embedded OpenCode server...')
        opencodeInstance = await createOpencode({
          hostname: '0.0.0.0',
          port: 4097,
          timeout: 15000,
          config: {
            model: process.env.DEFAULT_MODEL || 'opencode/grok-code-fast-1'
          }
        })
        console.log(`✅ Embedded OpenCode server started at ${opencodeInstance.server.url}`)
      } catch (err) {
        console.error('❌ Failed to start embedded OpenCode server:', err)
        throw err
      }
    }
    return { client: opencodeInstance.client, serverUrl: opencodeInstance.server.url }
  }
}

/**
 * Get the current OpenCode mode
 */
export function getOpencodeMode(): 'client' | 'embedded' {
  return (process.env.OPENCODE_MODE || 'embedded') as 'client' | 'embedded'
}

