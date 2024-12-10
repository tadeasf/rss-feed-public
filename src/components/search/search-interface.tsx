'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchFiltersDialog } from "./search-filters-dialog"
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { SearchResultsTable } from "./search-results-table"
import type { TorrentResult } from "@/types/torrent"

interface SearchFilters {
  category: string
  limit: number
}

export function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<TorrentResult[]>([])
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'All',
    limit: 20
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          ...filters
        }),
      })
      
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search torrents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <SearchFiltersDialog
          filters={filters}
          onFiltersChange={setFilters}
          trigger={
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          }
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <SearchResultsTable 
          results={results}
          selectedResults={selectedResults}
          onSelectionChange={setSelectedResults}
        />
      )}
    </div>
  )
} 