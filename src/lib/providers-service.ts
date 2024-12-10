'use server'
import type { TorrentProvider } from 'torrent-search-api'

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

// Move this to a separate utility file since it doesn't need to be a server action
export { getAllUniqueCategories } from '@/utils/category-utils' 