import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TorrentApiResponse, TorrentResult } from '@/types/torrent'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeTorrentResponse(torrent: TorrentApiResponse): TorrentResult {
  // Handle undefined or null size
  if (!torrent.size) {
    console.warn(`Missing size for torrent: ${torrent.title}, using 0 GB as fallback`)
    return {
      ...torrent,
      size: 0,
      sizeUnit: 'GB',
      originalSize: '0 GB',
      uploadDate: new Date()
    }
  }

  // Enhanced size parsing regex to handle more formats
  const sizeMatch = torrent.size.toString().match(/^([\d,.]+)\s*(KB|MB|GB|TB|B)?$/i)
  if (!sizeMatch) {
    console.warn(`Invalid size format: ${torrent.size}, using 0 GB as fallback`)
    return {
      ...torrent,
      size: 0,
      sizeUnit: 'GB',
      originalSize: torrent.size,
      uploadDate: new Date()
    }
  }

  const [, sizeValue_, unit = 'B'] = sizeMatch
  let sizeValue = sizeValue_
  // Handle comma as decimal separator and remove any thousands separators
  sizeValue = sizeValue.replace(',', '.').replace(/[^\d.]/g, '')
  const rawUnit = (unit.toUpperCase() || 'B')
  
  // Convert to GB for consistent comparison
  let sizeInGB = parseFloat(sizeValue)
  let sizeUnit: 'MB' | 'GB' | 'TB' = 'GB'

  switch (rawUnit) {
    case 'B':
      sizeInGB /= 1024 * 1024 * 1024
      sizeUnit = sizeInGB < 1 ? 'MB' : 'GB'
      break
    case 'KB':
      sizeInGB /= 1024 * 1024
      sizeUnit = sizeInGB < 1 ? 'MB' : 'GB'
      break
    case 'MB':
      sizeInGB /= 1024
      sizeUnit = 'MB'
      break
    case 'TB':
      sizeInGB *= 1024
      sizeUnit = 'TB'
      break
    default: // GB is our base unit
      sizeUnit = 'GB'
  }

  // Convert size to the appropriate unit
  let finalSize = sizeInGB
  if (sizeUnit === 'MB') {
    finalSize = sizeInGB * 1024
  } else if (sizeUnit === 'TB') {
    finalSize = sizeInGB / 1024
  }

  // Handle NaN results from parsing
  if (isNaN(finalSize)) {
    console.warn(`Failed to parse size: ${torrent.size}, using 0 GB as fallback`)
    finalSize = 0
    sizeUnit = 'GB'
  }

  // Parse date
  let date = new Date()
  try {
    const parsedDate = parseTorrentDate(torrent.uploadDate)
    if (parsedDate) {
      date = parsedDate
    }
  } catch {
    console.warn(`Invalid date format: ${torrent.uploadDate}, using current date`)
  }

  return {
    ...torrent,
    size: sizeInGB,
    sizeUnit,
    originalSize: torrent.size,
    uploadDate: date
  }
}

function parseTorrentDate(dateStr: string): Date | null {
  const formats = [
    {
      regex: /^(\w+)\.\s+(\d{2})(?:th|st|nd|rd)\s+'(\d{2})$/,
      parse: (match: RegExpMatchArray) => {
        const [, month, day, year] = match
        return new Date(`${month} ${day}, 20${year}`)
      }
    },
    {
      regex: /^(\d{4})-(\d{2})-(\d{2})$/,
      parse: (match: RegExpMatchArray) => new Date(match[0])
    },
    {
      regex: /^(\d{2})-(\d{2})-(\d{4})$/,
      parse: (match: RegExpMatchArray) => {
        const [, day, month, year] = match
        return new Date(`${year}-${month}-${day}`)
      }
    }
  ]

  for (const format of formats) {
    const match = dateStr.match(format.regex)
    if (match) {
      try {
        const date = format.parse(match)
        if (!isNaN(date.getTime())) {
          return date
        }
      } catch {
        console.warn(`Failed to parse date: ${dateStr} with format ${format.regex}`)
      }
    }
  }

  return null
}
