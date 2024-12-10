import type { TorrentProvider } from 'torrent-search-api'
import { getAllUniqueCategories } from '@/utils/category-utils'

export { getAllUniqueCategories }

export async function getActiveProviders(): Promise<TorrentProvider[]> {
  try {
    console.log('Initializing TorrentSearchApi for providers...')
    const TorrentSearchApi = (await import('torrent-search-api')).default
    
    console.log('Enabling public providers...')
    TorrentSearchApi.enablePublicProviders()
    
    const providers = TorrentSearchApi.getActiveProviders()
    console.log(`Found ${providers.length} active providers:`, 
      providers.map(p => p.name).join(', '))
    
    return providers
  } catch (error) {
    console.error('Detailed provider error:', {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      message: error instanceof Error ? error.message : String(error)
    })
    return []
  }
} 