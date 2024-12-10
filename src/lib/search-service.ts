import type { TorrentResult } from '@/types/torrent'

export async function searchTorrents(
  query: string,
  _category: string = 'All',
  _limit: number = 20
): Promise<TorrentResult[]> {
  // TODO: Implement actual torrent search here
  // This will be implemented using a different approach than torrent-search-api
  throw new Error('Not implemented')
} 