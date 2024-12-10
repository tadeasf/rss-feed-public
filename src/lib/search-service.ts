'use server'
import type { TorrentResult } from '@/types/torrent'
import type { Torrent as BaseTorrent, TorrentProvider } from 'torrent-search-api'

// Extend the base Torrent type with the additional fields we know exist
interface ExtendedTorrent extends BaseTorrent {
  seeds?: number
  peers?: number
  link?: string
  id?: string
  numFiles?: number
  status?: string
  category?: string
  imdb?: string
}

function mapTorrentToResult(torrent: ExtendedTorrent): TorrentResult {
  return {
    ...torrent,
    seeds: typeof torrent.seeds === 'number' ? torrent.seeds : 0,
    peers: typeof torrent.peers === 'number' ? torrent.peers : 0,
    // Ensure all required fields are present
    title: torrent.title || '',
    time: torrent.time || '',
    size: torrent.size || '',
    provider: torrent.provider || '',
    // Optional fields
    magnet: torrent.magnet,
    desc: torrent.desc,
    // Additional fields will be included from spread
  }
}

function getAllUniqueCategories(providers: TorrentProvider[]): string[] {
  if (!Array.isArray(providers)) {
    console.warn('Invalid providers input:', providers)
    return ['All']
  }

  const categoriesSet = new Set<string>(['All'])
  providers.forEach(provider => {
    if (Array.isArray(provider?.categories)) {
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
    const providers = TorrentSearchApi.getActiveProviders()
    
    if (!Array.isArray(providers)) {
      console.error('Invalid providers response:', providers)
      return []
    }
    
    return providers
  } catch (error) {
    console.error('Provider error:', {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      message: error instanceof Error ? error.message : String(error)
    })
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
    
    const torrents = await TorrentSearchApi.search(
      query,
      category,
      limit
    ) as ExtendedTorrent[] // Cast to our extended type
    
    if (!Array.isArray(torrents)) {
      console.error('Invalid search results:', torrents)
      return []
    }
    
    return torrents
      .map(mapTorrentToResult)
      .sort((a, b) => b.seeds - a.seeds)
  } catch (error) {
    console.error('Search error:', {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      message: error instanceof Error ? error.message : String(error)
    })
    throw new Error(`Failed to search torrents: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export { getAllUniqueCategories } 