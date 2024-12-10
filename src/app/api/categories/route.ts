import { NextResponse } from 'next/server'
import { getActiveProviders } from '@/lib/search-service'

function getAllUniqueCategories(providers: any[]): string[] {
  const categoriesSet = new Set<string>(['All'])
  providers.forEach(provider => {
    if (Array.isArray(provider?.categories)) {
      provider.categories.forEach((category: string) => {
        if (category && typeof category === 'string') {
          categoriesSet.add(category)
        }
      })
    }
  })
  return Array.from(categoriesSet).sort()
}

export async function GET() {
  try {
    const providers = await getActiveProviders()
    const categories = getAllUniqueCategories(providers)
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Failed to get categories:', error)
    return NextResponse.json(['All'])
  }
} 