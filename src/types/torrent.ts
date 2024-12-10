export interface TorrentResult {
  provider: string
  title: string
  time: string
  seeds: number
  peers: number
  size: string
  link?: string
  desc?: string
  magnet?: string
  // Optional fields from some providers
  id?: string
  numFiles?: number
  status?: string
  category?: string
  imdb?: string
} 