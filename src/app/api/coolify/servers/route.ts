import { NextResponse } from 'next/server'
import { getServers, isCoolifyConfigured } from '@/lib/coolify'

export async function GET() {
  try {
    if (!isCoolifyConfigured()) {
      return NextResponse.json({ 
        error: 'Coolify not configured' 
      }, { status: 503 })
    }

    const servers = await getServers()
    
    return NextResponse.json({ 
      servers,
      count: servers.length
    })
  } catch (error) {
    return NextResponse.json({ 
      error: (error as Error).message 
    }, { status: 500 })
  }
}
