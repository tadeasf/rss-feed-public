'use client'

import { SearchInterface } from "@/components/search/search-interface"

export default function SearchPage() {
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-8">Search Torrents</h2>
      <SearchInterface />
    </div>
  )
} 