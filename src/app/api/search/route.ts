// src/app/api/search/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { searchAllProviders } from '@/lib/search-service'
import { filterAndSortResults } from '@/lib/results-processor'
import { 
  DEFAULT_MIN_SEEDERS, 
  DEFAULT_MIN_SIZE, 
  DEFAULT_LIMIT,
  SearchApiFilters,
  BaseFilters
} from '@/lib/constants'

const searchParamsSchema = z.object({
  query: z.string().min(1),
  minSeeders: z.coerce.number().min(0).default(DEFAULT_MIN_SEEDERS),
  minSize: z.coerce.number().min(0).default(DEFAULT_MIN_SIZE),
  limit: z.coerce.number().min(1).default(DEFAULT_LIMIT),
  searchDepth: z.coerce.number().min(1).max(10).default(1)
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parsedParams = searchParamsSchema.parse({
      query: searchParams.get('query'),
      minSeeders: searchParams.get('minSeeders'),
      minSize: searchParams.get('minSize'),
      limit: searchParams.get('limit'),
      searchDepth: searchParams.get('searchDepth')
    })

    const results = await searchAllProviders(parsedParams.query, parsedParams.searchDepth)
    const baseFilters: BaseFilters = {
      minSeeders: parsedParams.minSeeders,
      minSize: parsedParams.minSize,
      limit: parsedParams.limit,
      searchDepth: parsedParams.searchDepth
    }
    const filteredResults = filterAndSortResults(results, baseFilters)

    return NextResponse.json(filteredResults)
  } catch (error) {
    console.error('Search error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search torrents' },
      { status: 500 }
    )
  }
}