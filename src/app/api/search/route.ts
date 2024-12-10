import { NextResponse } from 'next/server'
import { searchTorrents } from '@/lib/search-service'

export async function POST(request: Request) {
  try {
    const { query, category, limit } = await request.json()
    console.log('Search request received:', { query, category, limit })
    
    const results = await searchTorrents(query, category, limit)
    console.log(`Returning ${results.length} results`)
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Detailed API error:', {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      message: error instanceof Error ? error.message : String(error)
    })
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to perform search',
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    )
  }
} 