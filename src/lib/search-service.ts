'use server'
import type { TorrentResult } from '@/types/torrent'
import type { TorrentProvider } from 'torrent-search-api'

const TORRENT_SERVICE_URL = process.env.TORRENT_SERVICE_URL || 'http://localhost:3001'

export async function getActiveProviders(): Promise<TorrentProvider[]> {
  try {
    const response = await fetch(`${TORRENT_SERVICE_URL}/providers`)
    if (!response.ok) throw new Error('Failed to fetch providers')
    
    const providers = await response.json()
    return Array.isArray(providers) ? providers : []
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
    const response = await fetch(`${TORRENT_SERVICE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, category, limit })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Search failed')
    }
    
    const results = await response.json()
    return results.map(result => ({
      title: result.title || '',
      time: result.time || '',
      size: result.size || '',
      provider: result.provider || '',
      seeds: typeof result.seeds === 'number' ? result.seeds : 0,
      peers: typeof result.peers === 'number' ? result.peers : 0,
      magnet: result.magnet || '',
      desc: result.desc || '',
      link: result.link || '',
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