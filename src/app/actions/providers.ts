'use server'

import { getActiveProviders as getProviders } from '@/lib/providers-service'
import type { TorrentProvider } from 'torrent-search-api'

export async function getActiveProviders(): Promise<TorrentProvider[]> {
  return getProviders()
} 