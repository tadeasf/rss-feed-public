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

export function getAllUniqueCategories(providers: TorrentProvider[]): string[] {
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