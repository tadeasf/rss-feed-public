'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  SearchFilters, 
  AVAILABLE_LIMITS,
  SIZE_SLIDER_CONFIG,
  SEEDERS_SLIDER_CONFIG,
  SIMPLIFIED_CATEGORIES,
  DEPTH_SLIDER_CONFIG
} from '@/lib/constants'
import { TorrentCategory } from '@/types/torrent'

interface SearchFiltersDialogProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  trigger: React.ReactNode;
}

export function SearchFiltersDialog({ 
  filters, 
  onFiltersChange, 
  trigger
}: SearchFiltersDialogProps) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Filters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFiltersChange({ 
                ...filters, 
                category: value as TorrentCategory 
              })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {SIMPLIFIED_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Search Depth</Label>
            <Slider
              value={[filters.searchDepth]}
              onValueChange={([value]) => onFiltersChange({ 
                ...filters, 
                searchDepth: value ?? DEPTH_SLIDER_CONFIG.default 
              })}
              min={DEPTH_SLIDER_CONFIG.min}
              max={DEPTH_SLIDER_CONFIG.max}
              step={DEPTH_SLIDER_CONFIG.step}
            />
            <div className="text-sm text-muted-foreground">
              {filters.searchDepth} page{filters.searchDepth > 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="limit">Results Limit</Label>
            <Select
              value={filters.limit.toString()}
              onValueChange={(value) => onFiltersChange({ ...filters, limit: parseInt(value) })}
            >
              <SelectTrigger id="limit">
                <SelectValue placeholder="Select limit" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_LIMITS.map((limit) => (
                  <SelectItem key={limit} value={limit.toString()}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Minimum Size (GB)</Label>
            <Slider
              value={[filters.minSize]}
              onValueChange={([value]) => onFiltersChange({ ...filters, minSize: value ?? filters.minSize })}
              min={SIZE_SLIDER_CONFIG.min}
              max={SIZE_SLIDER_CONFIG.max}
              step={SIZE_SLIDER_CONFIG.step}
            />
            <div className="text-sm text-muted-foreground">
              {filters.minSize} GB
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Minimum Seeders</Label>
            <Slider
              value={[filters.minSeeders]}
              onValueChange={([value]) => onFiltersChange({ ...filters, minSeeders: value ?? filters.minSeeders })}
              min={SEEDERS_SLIDER_CONFIG.min}
              max={SEEDERS_SLIDER_CONFIG.max}
              step={SEEDERS_SLIDER_CONFIG.step}
            />
            <div className="text-sm text-muted-foreground">
              {filters.minSeeders} seeders
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 