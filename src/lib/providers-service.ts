import type { TorrentProvider } from 'torrent-search-api'
import { getAllUniqueCategories } from '@/utils/category-utils'

export { getAllUniqueCategories }

export async function getActiveProviders(): Promise<TorrentProvider[]> {
  try {
    const TorrentSearchApi = (await import('torrent-search-api')).default
    TorrentSearchApi.enablePublicProviders()
    return TorrentSearchApi.getActiveProviders()
  } catch (error) {
    console.error('Failed to get providers:', error)
    return []
  }
} 