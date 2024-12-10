export interface TorrentResult {
  provider: string
  title: string
  time: string
  seeds: number
  peers: number
  size: string
  link?: string
  desc: string
  magnet?: string
} 