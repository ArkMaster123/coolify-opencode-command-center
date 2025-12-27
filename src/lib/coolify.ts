const COOLIFY_API_URL = process.env.COOLIFY_API_URL || ''
const COOLIFY_API_TOKEN = process.env.COOLIFY_API_TOKEN || ''

interface CoolifyRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
}

export async function coolifyFetch<T>(endpoint: string, options: CoolifyRequestOptions = {}): Promise<T> {
  if (!COOLIFY_API_URL || !COOLIFY_API_TOKEN) {
    throw new Error('Coolify API not configured. Set COOLIFY_API_URL and COOLIFY_API_TOKEN.')
  }

  const url = `${COOLIFY_API_URL}/api${endpoint}`
  
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${COOLIFY_API_TOKEN}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Coolify API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export async function checkCoolifyHealth(): Promise<boolean> {
  try {
    if (!COOLIFY_API_URL || !COOLIFY_API_TOKEN) {
      return false
    }
    await coolifyFetch('/healthcheck')
    return true
  } catch {
    return false
  }
}

export interface CoolifyServer {
  id: number
  uuid: string
  name: string
  description?: string
  ip: string
  user: string
  port: number
  settings?: {
    is_reachable: boolean
    is_usable: boolean
  }
}

export interface CoolifyService {
  id: number
  uuid: string
  name: string
  description?: string
  status?: string
  type?: string
}

export async function getServers(): Promise<CoolifyServer[]> {
  return coolifyFetch<CoolifyServer[]>('/servers')
}

export async function getServer(uuid: string): Promise<CoolifyServer> {
  return coolifyFetch<CoolifyServer>(`/servers/${uuid}`)
}

export async function getServices(): Promise<CoolifyService[]> {
  return coolifyFetch<CoolifyService[]>('/services')
}

export async function getApplications(): Promise<unknown[]> {
  return coolifyFetch<unknown[]>('/applications')
}

export function isCoolifyConfigured(): boolean {
  return !!(COOLIFY_API_URL && COOLIFY_API_TOKEN)
}
