// Test script to verify OpenCode connection
import { createOpencodeClient } from '@opencode-ai/sdk'

async function testConnection() {
  try {
    console.log('🔄 Connecting to OpenCode server at 142.132.171.59:4096...')

    const client = createOpencodeClient({
      baseUrl: 'http://142.132.171.59:4096'
    })

    console.log('✅ Client created successfully')

    // Test getting config
    const config = await client.config.get()
    console.log('✅ Config fetched:', config)

    // Test getting providers
    try {
      const providersResponse = await client.config.providers()
      console.log('✅ Providers response:', providersResponse)
    } catch (error) {
      console.log('⚠️ Could not fetch providers:', error.message)
    }

    // Test getting agents
    const agents = await client.app.agents()
    console.log('✅ Available agents:', agents.length)

    // Test creating a session
    const session = await client.session.create({
      body: { title: 'Test Session' }
    })
    console.log('✅ Session created:', session.id)

    // Test sending a prompt
    const result = await client.session.prompt({
      path: { id: session.id },
      body: {
        model: { providerID: 'opencode', modelID: 'grok-code' },
        parts: [{ type: 'text', text: 'Hello, can you help me with coding?' }]
      }
    })

    console.log('✅ Prompt sent successfully')
    console.log('🤖 AI Response:', result.parts?.[0]?.text || 'No response')

    console.log('🎉 All tests passed! OpenCode is working correctly.')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Full error:', error)
  }
}

testConnection()
