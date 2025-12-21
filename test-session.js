// Test script to see what SDK actually returns
import { createOpencodeClient } from '@opencode-ai/sdk'

async function testSession() {
  try {
    console.log('🔍 Testing OpenCode SDK response format...\n')
    
    // Test WITHOUT responseStyle first
    const client = createOpencodeClient({
      baseUrl: 'http://127.0.0.1:4096'
      // responseStyle: 'data' // Testing default first
    })
    
    console.log('1️⃣ Testing config.get()...')
    const configResponse = await client.config.get()
    console.log('   Response keys:', configResponse ? Object.keys(configResponse).join(', ') : 'null')
    console.log('   Has error:', !!configResponse?.error)
    console.log('   Has response:', !!configResponse?.response)
    console.log('   Has data:', !!configResponse?.response?.data)
    if (configResponse?.error) {
      console.log('   ⚠️ Config error (this is OK):', configResponse.error.name)
    }
    if (configResponse?.response?.data) {
      console.log('   ✅ Config data:', JSON.stringify(configResponse.response.data, null, 2).substring(0, 150))
    }
    console.log()
    
    console.log('2️⃣ Testing session.create()...')
    const sessionResponse = await client.session.create({
      body: { title: 'Test Session' }
    })
    console.log('   Response keys:', sessionResponse ? Object.keys(sessionResponse).join(', ') : 'null')
    console.log('   Has error:', !!sessionResponse?.error)
    console.log('   Has response:', !!sessionResponse?.response)
    console.log('   Has data:', !!sessionResponse?.response?.data)
    if (sessionResponse?.error) {
      console.log('   ❌ Session error:', sessionResponse.error.name, sessionResponse.error.message)
    }
    const session = sessionResponse?.response?.data || sessionResponse?.data || sessionResponse
    console.log('   Session keys:', session ? Object.keys(session).join(', ') : 'null')
    console.log('   Has id:', !!session?.id)
    console.log('   Full session:', JSON.stringify(session, null, 2))
    console.log()
    
    if (session?.id) {
      console.log('3️⃣ Testing session.prompt()...')
      const promptResult = await client.session.prompt({
        path: { id: session.id },
        body: {
          model: { providerID: 'opencode', modelID: 'grok-code-fast-1' },
          parts: [{ type: 'text', text: 'Say hi' }]
        }
      })
      console.log('   Type:', typeof promptResult)
      console.log('   Keys:', promptResult ? Object.keys(promptResult).join(', ') : 'null')
      console.log('   Has parts:', !!promptResult?.parts)
      console.log('   Has data property:', !!promptResult?.data)
      console.log('   Data keys:', promptResult?.data ? Object.keys(promptResult.data).join(', ') : 'null')
      console.log('   Data parts:', promptResult?.data?.parts ? `Found ${promptResult.data.parts.length} parts` : 'No parts')
      console.log('   Has error:', !!promptResult?.error)
      if (promptResult?.error) {
        console.log('   Error:', promptResult.error.name, promptResult.error.message)
      }
      console.log('   Response status:', promptResult?.response?.status)
      console.log('   Response headers:', promptResult?.response?.headers ? Object.keys(promptResult.response.headers).join(', ') : 'none')
      console.log('   Full prompt result:', JSON.stringify(promptResult, null, 2))
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  }
}

testSession()

