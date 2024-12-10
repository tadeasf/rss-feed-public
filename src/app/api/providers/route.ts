import { NextResponse } from 'next/server'
import { getActiveProviders } from '@/lib/search-service'

export async function GET() {
  try {
    const providers = await getActiveProviders()
    return NextResponse.json(providers)
  } catch (error) {
    console.error('Failed to get providers:', error)
    return NextResponse.json({ error: 'Failed to get providers' }, { status: 500 })
  }
} 