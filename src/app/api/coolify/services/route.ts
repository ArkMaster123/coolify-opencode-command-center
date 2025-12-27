import { NextResponse } from 'next/server'
import { getServices, getApplications, isCoolifyConfigured } from '@/lib/coolify'

export async function GET() {
  try {
    if (!isCoolifyConfigured()) {
      return NextResponse.json({ 
        error: 'Coolify not configured' 
      }, { status: 503 })
    }

    const [services, applications] = await Promise.all([
      getServices().catch(() => []),
      getApplications().catch(() => [])
    ])
    
    return NextResponse.json({ 
      services,
      applications,
      totalServices: services.length,
      totalApplications: applications.length
    })
  } catch (error) {
    return NextResponse.json({ 
      error: (error as Error).message 
    }, { status: 500 })
  }
}
