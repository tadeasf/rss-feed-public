import { NextResponse } from 'next/server'
import { torrentProviders } from '@/lib/constants'

export async function GET() {
  try {
    // Convert providers to a simpler format for the frontend
    const providers = torrentProviders.map(provider => ({
      id: provider.id,
      name: provider.name
    }))
    
    return NextResponse.json(providers)
  } catch (error) {
    console.error('Failed to get providers:', error)
    return NextResponse.json(
      { error: 'Failed to get providers' }, 
      { status: 500 }
    )
  }
} 