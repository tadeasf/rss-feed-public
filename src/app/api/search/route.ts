import { NextResponse } from 'next/server'
import TorrentSearchApi from 'torrent-search-api'
import type { TorrentResult } from '@/types/torrent'

// Enable all public providers at once
TorrentSearchApi.enablePublicProviders()

export async function POST(request: Request) {
  try {
    const { query, category, limit } = await request.json()

    const results = await TorrentSearchApi.search(
      query,
      category === 'All' ? undefined : category,
      limit
    ) as TorrentResult[]

    // Sort by seeds
    const sortedResults = results.sort((a, b) => b.seeds - a.seeds)

    return NextResponse.json(sortedResults)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
} 