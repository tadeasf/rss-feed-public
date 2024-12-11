import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if torrent service is available
    const torrentResponse = await fetch(`${process.env.TORRENT_SERVICE_URL}/api/1337x/test`);
    const torrentStatus = torrentResponse.ok ? 'up' : 'down';

    return NextResponse.json({
      status: 'healthy',
      torrentService: torrentStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({
      status: 'unhealthy',
      torrentService: 'down',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 