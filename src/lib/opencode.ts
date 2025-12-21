import { createOpencode, createOpencodeClient } from '@opencode-ai/sdk'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let opencodeInstance: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let opencodeClient: any = null
let detectedMode: 'client' | 'embedded' | null = null

/**
 * Check if OpenCode server is running locally
 * Tries multiple endpoints to be sure
 */
async function checkLocalServer(serverUrl: string): Promise<boolean> {
  // Try multiple endpoints - if ANY respond, server is running
  const endpoints = ['/config', '/doc', '/project']
  
  for (const endpoint of endpoints) {
    try {
      // Use longer timeout and handle errors better
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout
      
      const response = await fetch(`${serverUrl}${endpoint}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      clearTimeout(timeoutId)
      
      // Any HTTP response (200-499) means server is running
      if (response.status >= 200 && response.status < 500) {
        console.log(`✅ OpenCode server detected at ${serverUrl}${endpoint} (status: ${response.status})`)
        return true
      }
    } catch (err) {
      // Log error for debugging but continue to next endpoint
      const errorMsg = err instanceof Error ? err.message : String(err)
      if (!errorMsg.includes('aborted') && !errorMsg.includes('ECONNREFUSED')) {
        console.log(`⚠️  Check ${endpoint} failed: ${errorMsg}`)
      }
      // Continue to next endpoint
      continue
    }
  }
  
  console.log(`❌ No OpenCode server found at ${serverUrl} (tried: ${endpoints.join(', ')})`)
  return false
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
  
  // ALWAYS check for local server first (unless explicitly set to embedded)
  let mode = explicitMode
  if (!mode || mode !== 'embedded') {
    console.log(`🔍 Checking for local OpenCode server at ${serverUrl}...`)
    let localServerRunning = await checkLocalServer(serverUrl)
    
    // Fallback: Try direct SDK connection test
    if (!localServerRunning) {
      try {
        const testClient = createOpencodeClient({ baseUrl: serverUrl })
        await testClient.config.get()
        localServerRunning = true
        console.log(`✅ Server found via SDK connection test`)
      } catch {
        // Server not available
      }
    }
    
    if (localServerRunning) {
      mode = 'client'
      detectedMode = 'client'
      console.log(`✅ Local server found - using CLIENT mode`)
    } else {
      mode = mode || 'embedded'
      detectedMode = mode as 'client' | 'embedded'
      console.log(`⚠️  No local server found - using ${mode.toUpperCase()} mode`)
    }
  } else {
    detectedMode = 'embedded'
    console.log(`📌 Using explicit mode: ${mode.toUpperCase()}`)
  }

  if (mode === 'client') {
    // CLIENT MODE: Connect to existing server
    if (!opencodeClient) {
      console.log(`🔌 CLIENT MODE: Connecting to OpenCode server at ${serverUrl}...`)
      // Use default responseStyle='fields' - returns { error?, request, response }
      // We'll extract data from response.data in our API routes
      opencodeClient = createOpencodeClient({
        baseUrl: serverUrl
      })
      
      // Test connection - even if config has errors, server is running
      try {
        await opencodeClient.config.get()
        console.log(`✅ Connected to OpenCode server at ${serverUrl}`)
      } catch (err) {
        // Config errors are OK - server is still running
        const errorMsg = err instanceof Error ? err.message : String(err)
        if (errorMsg.includes('ConfigInvalidError') || errorMsg.includes('config')) {
          console.log(`⚠️  OpenCode server connected but config has warnings (this is OK)`)
        } else {
          console.error(`❌ Failed to connect to OpenCode server at ${serverUrl}`)
          console.error(`   Error: ${errorMsg}`)
          console.error(`   Make sure OpenCode server is running:`)
          console.error(`   opencode serve --hostname 127.0.0.1 --port 4096`)
          throw new Error(`Cannot connect to OpenCode server at ${serverUrl}. Is it running?`)
        }
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
        
        // If embedded fails, try falling back to client mode
        if (errorMessage.includes('EADDRINUSE') || errorMessage.includes('port')) {
          console.error('❌ Port conflict! Embedded server cannot start.')
          console.log('🔄 Falling back to CLIENT mode...')
          
          // Try client mode as fallback
          const localServerRunning = await checkLocalServer(serverUrl)
          if (localServerRunning) {
            console.log('✅ Found local OpenCode server - switching to CLIENT mode')
            // Recursively call with client mode
            process.env.OPENCODE_MODE = 'client'
            return getOpencodeClient()
          } else {
            console.error(`   Port ${process.env.OPENCODE_PORT || '4097'} is already in use.`)
            console.error('   Solutions:')
            console.error('   1. Use CLIENT mode: OPENCODE_MODE=client npm run dev')
            console.error('   2. Start local server: opencode serve --hostname 127.0.0.1 --port 4096')
            console.error('   3. Use different port: OPENCODE_PORT=4098 npm run dev')
          }
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
  // Return detected mode if available, otherwise check env or default
  if (detectedMode) {
    return detectedMode
  }
  return (process.env.OPENCODE_MODE || 'embedded') as 'client' | 'embedded'
}

