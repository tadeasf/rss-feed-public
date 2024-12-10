import { NextResponse } from 'next/server'
import type { TorrentResult } from '@/types/torrent'

// Mock data for development - replace with actual implementation later
const mockResults: TorrentResult[] = [
  {
    provider: "1337x",
    title: "Sample Torrent 1",
    time: "2024-01-01",
    seeds: 100,
    peers: 50,
    size: "1.5 GB",
    desc: "https://example.com/torrent1",
  },
  // Add more mock data as needed
]

export async function POST(request: Request) {
  try {
    const { query, category, limit } = await request.json()

    // TODO: Implement actual torrent search using a different approach
    // For now, return mock data
    const results = mockResults
      .filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) &&
        (category === 'All' || category === result.provider)
      )
      .slice(0, limit)
      .sort((a, b) => b.seeds - a.seeds)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
} 