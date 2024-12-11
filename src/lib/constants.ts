import { TorrentCategory } from '@/types/torrent'

// Timing and performance configs
export const DEFAULT_TIMEOUT = 5000 // 5 seconds
export const MAX_CONCURRENT_PROVIDERS = 5
export const PROVIDER_BATCH_SIZE = 4
export const TORRENT_SERVICE_URL = process.env.NEXT_PUBLIC_TORRENT_SERVICE_URL || 'http://torrent-service:3001'

// Default values
export const DEFAULT_MIN_SEEDERS = 5
export const DEFAULT_MIN_SIZE = 1
export const DEFAULT_LIMIT = 20
export const AVAILABLE_LIMITS = [5, 10, 20, 50] as const

// Slider configurations
export const SIZE_SLIDER_CONFIG = {
  min: 0,
  max: 20,
  step: 0.5,
  default: DEFAULT_MIN_SIZE
} as const

export const SEEDERS_SLIDER_CONFIG = {
  min: 0,
  max: 100,
  step: 5,
  default: DEFAULT_MIN_SEEDERS
} as const

export const DEPTH_SLIDER_CONFIG = {
  min: 1,
  max: 10,
  step: 1,
  default: 1
} as const

// Base interface for common filters
export interface BaseFilters {
  minSeeders: number
  minSize: number
  limit: number
  searchDepth: number
}

// API filters (includes query)
export interface SearchApiFilters extends BaseFilters {
  query: string
}

// UI filters (includes category)
export interface SearchFilters extends BaseFilters {
  category: TorrentCategory
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  category: TorrentCategory.ALL,
  minSeeders: DEFAULT_MIN_SEEDERS,
  minSize: DEFAULT_MIN_SIZE,
  limit: DEFAULT_LIMIT,
  searchDepth: DEPTH_SLIDER_CONFIG.default
}

// Size configurations
export const SIZE_UNITS = {
  B: 1 / 1024 / 1024 / 1024, // Convert to GB
  KB: 1 / 1024 / 1024,
  MB: 1 / 1024,
  GB: 1,
  TB: 1024
} as const

export function parseSize(sizeStr: string): { size: number, unit: keyof typeof SIZE_UNITS } {
  const match = sizeStr.match(/^([\d,.]+)\s*(KB|MB|GB|TB|B)?$/i)
  if (!match) return { size: 0, unit: 'GB' }

  const [, value, unit = 'B'] = match
  const size = parseFloat(value.replace(',', '.'))
  const normalizedUnit = (unit.toUpperCase() || 'B') as keyof typeof SIZE_UNITS

  return { size, unit: normalizedUnit }
}

// Torrent providers configuration
export const torrentProviders = [
  {
    id: '1337x',
    name: '1337x',
    baseUrl: 'https://1337xx.to'
  },
  {
    id: 'yts',
    name: 'YTS', 
    baseUrl: 'https://yts.mx'
  },
  {
    id: 'eztv',
    name: 'EZTV',
    baseUrl: 'https://eztv.re'
  },
  {
    id: 'tgx',
    name: 'Torrent Galaxy',
    baseUrl: 'https://torrentgalaxy.to'
  },
  {
    id: 'torlock',
    name: 'Torlock',
    baseUrl: 'https://www.torlock.com'
  },
  {
    id: 'piratebay',
    name: 'PirateBay',
    baseUrl: 'https://thehiddenbay.com'
  },
  {
    id: 'nyaasi',
    name: 'Nyaa.si',
    baseUrl: 'https://nyaa.si'
  },
  {
    id: 'rarbg',
    name: 'RARBG',
    baseUrl: 'https://rargb.to'
  },
  {
    id: 'ettv',
    name: 'ETTV',
    baseUrl: 'https://www.ettvcentral.com'
  },
  {
    id: 'zooqle',
    name: 'Zooqle',
    baseUrl: 'https://zooqle.com'
  },
  {
    id: 'kickass',
    name: 'KickAss',
    baseUrl: 'https://kickasstorrents.to'
  },
  {
    id: 'bitsearch',
    name: 'Bitsearch',
    baseUrl: 'https://bitsearch.to'
  },
  {
    id: 'glodls',
    name: 'Glodls',
    baseUrl: 'https://glodls.to/home.php'
  },
  {
    id: 'magnetdl',
    name: 'MagnetDL',
    baseUrl: 'https://www.magnetdl.com'
  },
  {
    id: 'limetorrent',
    name: 'LimeTorrent',
    baseUrl: 'https://www.limetorrents.pro/home'
  },
  {
    id: 'torrentfunk',
    name: 'TorrentFunk',
    baseUrl: 'https://www.torrentfunk.com'
  },
  {
    id: 'torrentproject',
    name: 'TorrentProject',
    baseUrl: 'https://torrentproject2.com'
  }
] as const

export type ProviderId = typeof torrentProviders[number]['id']

// Simplified categories for UI
export const SIMPLIFIED_CATEGORIES = [
  TorrentCategory.ALL,
  TorrentCategory.MOVIES,
  TorrentCategory.TV,
  TorrentCategory.ADULT
] as const