import { NextRequest } from 'next/server'
import { getOpencodeClient } from '@/lib/opencode'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const { message, model = 'opencode/grok-code-fast-1', agent = 'build' } = await request.json()

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { client } = await getOpencodeClient()
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'status', content: 'Connected to OpenCode...' })}\n\n`))

        const [providerID, modelID] = model.split('/')
        const actualModelID = modelID === 'grok-code-fast-1' ? 'grok-code' : modelID

        const sessionResponse = await client.session.create({
          body: { title: 'Streaming Chat' }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any

        const session = sessionResponse?.response?.data || sessionResponse?.data || sessionResponse
        
        if (!session?.id) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', content: 'Failed to create session' })}\n\n`))
          controller.close()
          return
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'status', content: 'Processing...' })}\n\n`))

        await client.session.prompt({
          path: { id: session.id },
          body: {
            model: { providerID, modelID: actualModelID },
            agent,
            parts: [{ type: 'text', text: message }]
          }
        })

        let attempts = 0
        const maxAttempts = 10
        let foundResponse = false

        while (attempts < maxAttempts && !foundResponse) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const messagesResponse = await client.session.messages({ path: { id: session.id } })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const messages = (messagesResponse as any)?.response?.data || (messagesResponse as any)?.data || messagesResponse

          if (Array.isArray(messages)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const assistantMessages = messages.filter((m: any) => m.info?.role === 'assistant')
            const lastAssistant = assistantMessages[assistantMessages.length - 1]

            if (lastAssistant?.parts?.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              for (const part of lastAssistant.parts) {
                if (part.type === 'text' && part.text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: part.text })}\n\n`))
                  foundResponse = true
                } else if (part.type === 'tool-call') {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'command', command: part.name, args: part.args })}\n\n`))
                } else if (part.type === 'tool-result') {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'output', content: part.output || part.result })}\n\n`))
                }
              }
            }
          }

          attempts++
          
          if (!foundResponse && attempts < maxAttempts) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'status', content: 'Still thinking...' })}\n\n`))
          }
        }

        if (!foundResponse) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: 'Response took too long. Please try again.' })}\n\n`))
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
        controller.close()
      } catch (error) {
        console.error('Stream error:', error)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', content: (error as Error).message })}\n\n`))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
