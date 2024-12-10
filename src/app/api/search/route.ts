import { NextResponse } from 'next/server'
import { searchTorrents } from '@/lib/search-service'

export async function POST(request: Request) {
  try {
    const { query, category, limit } = await request.json()
    
    const results = await searchTorrents(query, category, limit)
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
} 