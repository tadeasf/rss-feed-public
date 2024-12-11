// src/lib/search-service.ts
'use server'

import { TorrentResult } from '@/types/torrent'
import { TORRENT_SERVICE_URL, torrentProviders } from './constants'
import { normalizeResults } from './results-processor'

// Fetch results from a single provider
async function fetchProviderResults(providerId: string, query: string, page = 1): Promise<TorrentResult[]> {
  try {
    const url = `${TORRENT_SERVICE_URL}/api/${providerId}/${encodeURIComponent(query)}/${page}`
    const response = await fetch(url, { 
      next: { revalidate: 0 },
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) {
      console.warn(`Provider ${providerId} returned status ${response.status}`)
      return []
    }
    
    const results = await response.json()
    return Array.isArray(results) ? normalizeResults(results, providerId) : []
  } catch (error) {
    console.error(`Error fetching from ${providerId}:`, error)
    return []
  }
}

export async function searchAllProviders(query: string, depth = 1): Promise<TorrentResult[]> {
  const searchPromises = torrentProviders.flatMap(provider => 
    Array.from({ length: depth }, (_, i) => 
      fetchProviderResults(provider.id, query, i + 1)
    )
  )
  
  const results = await Promise.allSettled(searchPromises)
  
  return results
    .filter((result): result is PromiseFulfilledResult<TorrentResult[]> => 
      result.status === 'fulfilled'
    )
    .flatMap(result => result.value)
}

export async function getActiveProviders() {
  const response = await fetch('http://torrent-service:3001/api/providers')
  if (!response.ok) throw new Error('Failed to fetch providers')
  return response.json()
}