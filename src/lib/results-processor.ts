import { TorrentResult } from '@/types/torrent'
import { BaseFilters } from './constants'
import { normalizeSize, mapCategory } from './utils/normalize'

export function normalizeResults(results: any[], providerId: string): TorrentResult[] {
  return results.map(result => {
    const sizeStr = result.Size || result.size || '0 GB'
    const { size, sizeUnit } = normalizeSize(sizeStr)
    
    let uploadDate = result.DateUploaded || result.uploadDate
    if (uploadDate && typeof uploadDate === 'string') {
      try {
        uploadDate = new Date(uploadDate).toISOString()
      } catch {
        console.warn(`Invalid date format for ${result.title}:`, uploadDate)
        uploadDate = new Date().toISOString()
      }
    }

    return {
      title: result.Name || result.title,
      magnet: result.Magnet || result.magnet,
      size,
      sizeUnit,
      seeders: parseInt(result.Seeders || result.seeders) || 0,
      leechers: parseInt(result.Leechers || result.leechers) || 0,
      category: mapCategory(result.Category || result.category),
      uploadDate,
      provider: providerId,
      originalSize: sizeStr,
      url: result.Url || result.url
    } satisfies TorrentResult
  })
}

export function filterAndSortResults(results: TorrentResult[], filters: BaseFilters): TorrentResult[] {
  return results
    .filter(result => {
      const sizeInGB = result.sizeUnit === 'TB' ? result.size * 1024 :
                      result.sizeUnit === 'MB' ? result.size / 1024 :
                      result.size

      return result.seeders >= filters.minSeeders &&
             sizeInGB >= filters.minSize
    })
    .sort((a, b) => b.seeders - a.seeders)
    .slice(0, filters.limit)
} 