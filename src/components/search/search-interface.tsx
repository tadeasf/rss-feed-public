'use client'

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchFiltersDialog } from "./search-filters-dialog"
import { Search, SlidersHorizontal, Loader2, Download } from "lucide-react"
import { SearchResultsTable } from "./search-results-table"
import { TorrentResult } from "@/types/torrent"
import { TorrentCategory } from "@/types/torrent"
import { 
  SearchFilters, 
  DEFAULT_SEARCH_FILTERS,
  DEFAULT_MIN_SEEDERS,
  DEFAULT_MIN_SIZE,
  DEFAULT_LIMIT,
  DEPTH_SLIDER_CONFIG
} from '@/lib/constants'

export function SearchInterface() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS)
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<TorrentResult[]>([])
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set())
  const [isDownloading, setIsDownloading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    try {
      const searchParams = {
        query: searchQuery,
        minSeeders: filters.minSeeders.toString(),
        minSize: filters.minSize.toString(),
        limit: filters.limit.toString(),
        searchDepth: filters.searchDepth.toString()
      }

      const params = new URLSearchParams(searchParams)
      const response = await fetch(`/api/search?${params}`)
      if (!response.ok) throw new Error('Search failed')
      
      const results = await response.json()
      const filteredResults = results.filter((result: TorrentResult) => 
        filters.category === TorrentCategory.ALL || 
        result.category === filters.category
      )
      setResults(filteredResults)
    } catch (error) {
      toast({
        title: "Error",
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
      const selectedTorrents = results
        .filter(result => 
          selectedResults.has(result.title) && 
          result.magnet
        )
        .map(torrent => ({
          magnet: torrent.magnet!,
          title: torrent.title
        }))

      if (selectedTorrents.length === 0) {
        throw new Error("Selected torrents don't have valid magnet links")
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

      const data = await response.json()
      
      toast({
        title: "Torrents Added Successfully",
        description: `Added ${data.count} torrent${data.count > 1 ? 's' : ''} to your feed. View them on the home page.`,
        variant: "default",
        duration: 5000, // Show for 5 seconds
      })
      
      // Clear selections after successful download
      setSelectedResults(new Set())
    } catch (error) {
      console.error('Download failed:', error)
      toast({
        title: "Failed to Add Torrents",
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
          onFiltersChange={(newFilters) => setFilters(newFilters)}
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