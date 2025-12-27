import { NextResponse } from 'next/server'
import { getOpencodeClient } from '@/lib/opencode'

// List files in a directory
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path') || '/'

    const { client } = await getOpencodeClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (client as any).file?.list?.({ query: { path } }) 
      || await fetch(`${process.env.OPENCODE_SERVER_URL || 'http://127.0.0.1:4096'}/file?path=${encodeURIComponent(path)}`)
        .then(r => r.json())

    return NextResponse.json(result)

  } catch (error) {
    console.error('Files API error:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

// Read a file
export async function POST(request: Request) {
  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }

    const { client } = await getOpencodeClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (client as any).file?.read?.({ query: { path } })
    const content = result?.response?.data || result?.data || result

    return NextResponse.json({
      path,
      content
    })

  } catch (error) {
    console.error('File read error:', error)
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
