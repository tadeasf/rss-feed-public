export enum TorrentCategory {
  ALL = 'ALL',
  MOVIES = 'MOVIES',
  TV = 'TV',
  ADULT = 'ADULT'
}

// Base torrent interface
export interface BaseTorrent {
  title: string
  magnet?: string
  size: string
  seeders: number
  leechers: number
  category: TorrentCategory
  uploadDate: string
  provider: string
}

// Response from external API
export interface TorrentApiResponse {
  title: string
  magnet: string
  size: string
  seeders: number
  leechers: number
  category: string
  uploadDate: string
  provider: string
  desc?: string
  url?: string
  downloads?: number
}

// Our normalized torrent result
export interface TorrentResult {
  title: string
  magnet: string
  size: number // Normalized to GB
  seeders: number
  leechers: number
  category: string
  uploadDate: string | Date
  provider: string
  desc?: string
  url?: string
  downloads?: number
  sizeUnit: 'MB' | 'GB' | 'TB'
  originalSize: string
  
} 