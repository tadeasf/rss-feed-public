import type { TorrentResult } from '@/types/torrent'

export async function searchTorrents(
  query: string,
  category: string = 'All',
  limit: number = 20
): Promise<TorrentResult[]> {
  try {
    const TorrentSearchApi = (await import('torrent-search-api')).default
    TorrentSearchApi.enablePublicProviders()

    const results = await TorrentSearchApi.search(
      query,
      category,
      limit
    ) as TorrentResult[]

    return results.sort((a, b) => (b.seeds || 0) - (a.seeds || 0))
  } catch (error) {
    console.error('Torrent search error:', error)
    throw new Error('Failed to search torrents')
  }
} 