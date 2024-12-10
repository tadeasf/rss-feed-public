import { NextResponse } from 'next/server'
import { getActiveProviders } from '@/lib/providers-service'

export async function GET() {
  try {
    const providers = await getActiveProviders()
    return NextResponse.json(providers)
  } catch (error) {
    console.error('Providers error:', error)
    return NextResponse.json(
      { error: 'Failed to get providers' },
      { status: 500 }
    )
  }
} 