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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Select</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Seeds</TableHead>
          <TableHead>Peers</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Time</TableHead>
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
              {(result.desc || result.magnet) ? (
                <a 
                  href={result.desc || result.magnet}
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
            <TableCell>{result.size}</TableCell>
            <TableCell>{result.seeds}</TableCell>
            <TableCell>{result.peers}</TableCell>
            <TableCell>{result.provider}</TableCell>
            <TableCell>{result.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 