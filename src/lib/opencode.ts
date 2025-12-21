import { createOpencode, createOpencodeClient } from '@opencode-ai/sdk'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let opencodeInstance: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let opencodeClient: any = null

/**
 * Check if OpenCode server is running locally
 */
async function checkLocalServer(serverUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${serverUrl}/config`, {
      method: 'GET',
      signal: AbortSignal.timeout(1000) // 1 second timeout
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get OpenCode client - works in both modes:
 * - CLIENT mode: Connects to existing opencode server (for local dev)
 * - EMBEDDED mode: Starts embedded server (for production/Coolify)
 * 
 * Auto-detects: If OPENCODE_MODE not set, checks if local server is running
 */
export async function getOpencodeClient() {
  const explicitMode = process.env.OPENCODE_MODE
  const serverUrl = process.env.OPENCODE_SERVER_URL || 'http://127.0.0.1:4096'
  
  // Auto-detect: If no explicit mode, check if local server is running
  let mode = explicitMode
  if (!mode) {
    const localServerRunning = await checkLocalServer(serverUrl)
    mode = localServerRunning ? 'client' : 'embedded'
    console.log(`🔍 Auto-detected mode: ${mode} (local server ${localServerRunning ? 'found' : 'not found'})`)
  }

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
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        console.error(`❌ Failed to connect to OpenCode server at ${serverUrl}`)
        console.error(`   Error: ${errorMsg}`)
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
        const port = parseInt(process.env.OPENCODE_PORT || '4097')
        opencodeInstance = await createOpencode({
          hostname: '0.0.0.0',
          port: port,
          timeout: 15000,
          config: {
            model: process.env.DEFAULT_MODEL || 'opencode/grok-code-fast-1'
          }
        })
        console.log(`✅ Embedded OpenCode server started at ${opencodeInstance.server.url}`)
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (err as any)?.message || String(err)
        if (errorMessage.includes('EADDRINUSE') || errorMessage.includes('port')) {
          console.error('❌ Port conflict! Embedded server cannot start.')
          console.error(`   Port ${process.env.OPENCODE_PORT || '4097'} is already in use.`)
          console.error('   Solutions:')
          console.error('   1. Use CLIENT mode: OPENCODE_MODE=client npm run dev')
          console.error('   2. Start local server: opencode serve --hostname 127.0.0.1 --port 4096')
          console.error('   3. Use different port: OPENCODE_PORT=4098 npm run dev')
        }
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

