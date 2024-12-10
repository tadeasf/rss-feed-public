// Base type from torrent-search-api
export interface Torrent {
  title: string
  time: string
  size: string
  magnet: string
  desc: string
  provider: string
}

// Extended type with additional fields we get from the API
export interface TorrentApiResult extends Torrent {
  seeds?: number
  peers?: number
  link?: string
  id?: string
  numFiles?: number
  status?: string
  category?: string
  imdb?: string
}

// Our application's normalized type
export interface TorrentResult {
  title: string
  time: string
  size: string
  provider: string
  seeds: number
  peers: number
  magnet?: string
  desc?: string
  link?: string
  id?: string
  numFiles?: number
  status?: string
  category?: string
  imdb?: string
} 