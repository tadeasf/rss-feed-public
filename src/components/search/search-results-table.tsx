'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { TorrentResult } from "@/types/torrent"

interface SearchResultsTableProps {
  results: TorrentResult[]
  selectedResults: Set<string>
  onSelectionChange: (selected: Set<string>) => void
}

export function SearchResultsTable({ 
  results, 
  selectedResults, 
  onSelectionChange 
}: SearchResultsTableProps) {
  const handleSelect = (title: string) => {
    const newSelected = new Set(selectedResults)
    if (newSelected.has(title)) {
      newSelected.delete(title)
    } else {
      newSelected.add(title)
    }
    onSelectionChange(newSelected)
  }

  function formatSize(result: TorrentResult): string {
    return `${result.originalSize}`
  }

  function formatDate(date: Date | string | null): string {
    if (!date) return 'Unknown'
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      console.warn('Failed to format date:', date)
      return 'Invalid Date'
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Seeders</TableHead>
            <TableHead>Leechers</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={`${result.title}-${result.provider}`}>
            <TableCell>
              <Checkbox
                checked={selectedResults.has(result.title)}
                onCheckedChange={() => handleSelect(result.title)}
              />
            </TableCell>
            <TableCell className="font-medium">
                {result.url ? (
                <a 
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-500"
                >
                  {result.title}
                </a>
                ) : (
                result.title
                )}
              </TableCell>
              <TableCell>{result.category}</TableCell>
              <TableCell>{formatSize(result)}</TableCell>
            <TableCell>{result.seeders}</TableCell>
            <TableCell>{result.leechers}</TableCell>
            <TableCell>{result.provider}</TableCell>
            <TableCell>{formatDate(result.uploadDate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 