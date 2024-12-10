'use server'
import type { TorrentResult } from '@/types/torrent'
import type { TorrentProvider } from 'torrent-search-api'

interface ExtendedTorrent {
  title: string
  time: string
  size: string
  magnet: string
  desc: string
  provider: string
  seeds?: number
  peers?: number
  link?: string
  id?: string
  numFiles?: number
  status?: string
  category?: string
  imdb?: string
}

// Move the TorrentSearchApi initialization to a separate function
async function initializeTorrentApi() {
  if (typeof window !== 'undefined') {
    throw new Error('This module can only be used on the server')
  }
  
  try {
    const TorrentSearchApi = (await import('torrent-search-api')).default
    TorrentSearchApi.enablePublicProviders()
    return TorrentSearchApi
  } catch (error) {
    console.error('Failed to initialize torrent API:', error)
    throw error
  }
}

export async function getActiveProviders(): Promise<TorrentProvider[]> {
  try {
    const api = await initializeTorrentApi()
    const providers = api.getActiveProviders()
    
    if (!Array.isArray(providers)) {
      console.error('Invalid providers response:', providers)
      return []
    }
    
    return providers
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
    const api = await initializeTorrentApi()
    
    const results = await api.search(
      query,
      category,
      limit
    ) as ExtendedTorrent[]
    
    if (!Array.isArray(results)) {
      console.error('Invalid search results:', results)
      return []
    }
    
    return results.map(result => ({
      title: result.title || '',
      time: result.time || '',
      size: result.size || '',
      provider: result.provider || '',
      seeds: typeof result.seeds === 'number' ? result.seeds : 0,
      peers: typeof result.peers === 'number' ? result.peers : 0,
      magnet: result.magnet,
      desc: result.desc,
      link: result.link,
      id: result.id,
      numFiles: result.numFiles,
      status: result.status,
      category: result.category,
      imdb: result.imdb
    }))
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
} 