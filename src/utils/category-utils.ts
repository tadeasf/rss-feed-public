import type { TorrentProvider } from 'torrent-search-api'

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