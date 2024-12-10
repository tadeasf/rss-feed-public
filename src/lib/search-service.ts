'use server'
import type { TorrentResult } from '@/types/torrent'

export async function searchTorrents(
  query: string,
  category: string = 'All',
  limit: number = 20
): Promise<TorrentResult[]> {
  try {
    const TorrentSearchApi = (await import('torrent-search-api')).default
    console.log('Initializing TorrentSearchApi...')
    
    TorrentSearchApi.enablePublicProviders()
    console.log('Public providers enabled')
    
    console.log(`Searching for "${query}" in category "${category}" with limit ${limit}`)
    const results = await TorrentSearchApi.search(
      query,
      category,
      limit
    ) as TorrentResult[]
    
    console.log(`Found ${results.length} results`)
    return results.sort((a, b) => (b.seeds || 0) - (a.seeds || 0))
  } catch (error) {
    console.error('Detailed torrent search error:', {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      message: error instanceof Error ? error.message : String(error)
    })
    throw new Error(`Failed to search torrents: ${error instanceof Error ? error.message : String(error)}`)
  }
} 