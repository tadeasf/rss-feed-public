'use server'
import type { TorrentResult } from '@/types/torrent'
import type { TorrentProvider } from 'torrent-search-api'

function getAllUniqueCategories(providers: TorrentProvider[]): string[] {
  const categoriesSet = new Set<string>(['All'])
  providers.forEach(provider => {
    if (Array.isArray(provider.categories)) {
      provider.categories.forEach(category => {
        if (category && typeof category === 'string') {
          categoriesSet.add(category)
        }
      })
    }
  })
  return Array.from(categoriesSet).sort()
}

export async function getActiveProviders(): Promise<TorrentProvider[]> {
  try {
    const TorrentSearchApi = (await import('torrent-search-api')).default
    TorrentSearchApi.enablePublicProviders()
    return TorrentSearchApi.getActiveProviders()
  } catch (error) {
    console.error('Provider error:', error)
    return []
  }
}

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
    console.error('Search error:', error)
    throw new Error(`Failed to search torrents: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export { getAllUniqueCategories } 