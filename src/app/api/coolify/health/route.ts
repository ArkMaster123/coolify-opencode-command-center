import { NextResponse } from 'next/server'
import { checkCoolifyHealth, isCoolifyConfigured } from '@/lib/coolify'

export async function GET() {
  try {
    if (!isCoolifyConfigured()) {
      return NextResponse.json({ 
        connected: false, 
        error: 'Coolify not configured' 
      }, { status: 503 })
    }

    const healthy = await checkCoolifyHealth()
    
    return NextResponse.json({ 
      connected: healthy,
      configured: true
    })
  } catch (error) {
    return NextResponse.json({ 
      connected: false, 
      error: (error as Error).message 
    }, { status: 500 })
  }
}
