'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchFiltersDialog } from "./search-filters-dialog"
import { Search, SlidersHorizontal, Loader2, Download } from "lucide-react"
import { SearchResultsTable } from "./search-results-table"
import { useToast } from "@/hooks/use-toast"
import type { TorrentResult } from "@/types/torrent"

interface SearchFilters {
  category: string
  limit: number
}

export function SearchInterface() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<TorrentResult[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'All',
    limit: 20
  })
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : ['All'])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories(['All'])
      }
    }

    fetchCategories()
  }, [])

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
      if (data.error) {
        throw new Error(data.error)
      }
      
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to perform search",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (selectedResults.size === 0) {
      toast({
        title: "No torrents selected",
        description: "Please select at least one torrent to download",
        variant: "destructive",
      })
      return
    }

    setIsDownloading(true)
    try {
      const selectedTorrents = results.filter(result => 
        selectedResults.has(result.title) && result.magnet
      ).map(torrent => ({
        magnet: torrent.magnet,
        title: torrent.title
      }))

      if (selectedTorrents.length === 0) {
        throw new Error("No valid magnet links found in selected torrents")
      }

      const response = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          torrents: selectedTorrents
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add torrents')
      }

      toast({
        title: "Success",
        description: `Added ${selectedTorrents.length} torrent(s) to your feed`,
      })
      
      // Clear selections after successful download
      setSelectedResults(new Set())
    } catch (error) {
      console.error('Download failed:', error)
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to add torrents to feed",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
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
          categories={categories}
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
        <>
          <SearchResultsTable 
            results={results}
            selectedResults={selectedResults}
            onSelectionChange={setSelectedResults}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleDownload} 
              disabled={isDownloading || selectedResults.size === 0}
              className="w-[200px]"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding to Feed...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Add to Feed ({selectedResults.size})
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
} 