import { NextResponse } from 'next/server'
import { SIMPLIFIED_CATEGORIES } from '@/lib/constants'

export async function GET() {
  try {
    return NextResponse.json(SIMPLIFIED_CATEGORIES)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 