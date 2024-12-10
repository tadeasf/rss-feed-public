import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const TorrentSearchApi = (await import('torrent-search-api')).default
    TorrentSearchApi.enablePublicProviders()
    const providers = TorrentSearchApi.getActiveProviders()
    
    return NextResponse.json({
      status: 'healthy',
      providers: providers.map(p => p.name)
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 