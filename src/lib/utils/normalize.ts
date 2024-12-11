import filesize from 'filesize-parser'
import { TorrentCategory } from '@/types/torrent'

export function normalizeSize(sizeStr: string): { size: number, sizeUnit: 'MB' | 'GB' | 'TB' } {
  try {
    const bytes = filesize(sizeStr)
    
    if (bytes >= 1099511627776) { // TB
      return { size: bytes / 1099511627776, sizeUnit: 'TB' }
    } else if (bytes >= 1073741824) { // GB
      return { size: bytes / 1073741824, sizeUnit: 'GB' }
    } else {
      return { size: bytes / 1048576, sizeUnit: 'MB' }
    }
  } catch {
    return { size: 0, sizeUnit: 'GB' }
  }
}
export function mapCategory(category: string): TorrentCategory {
  const normalizedCategory = category.toLowerCase()
  
  if (normalizedCategory.includes('movie') || 
      normalizedCategory.includes('film')) {
    return TorrentCategory.MOVIES
  }
  
  if (normalizedCategory.includes('tv') || 
      normalizedCategory.includes('television') || 
      normalizedCategory.includes('series')) {
    return TorrentCategory.TV
  }
  
  if (normalizedCategory.includes('xxx') || 
      normalizedCategory.includes('adult') || 
      normalizedCategory.includes('porn') ||
      normalizedCategory.includes('18+')) {
    return TorrentCategory.ADULT
  }
  
  return TorrentCategory.ALL
} 