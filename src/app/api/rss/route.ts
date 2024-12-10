import { NextResponse } from 'next/server'
import { Feed } from '@/models/Feed'
import connectDB from '@/lib/mongodb'
import RSS from 'rss'

function generateRSSFeed(items: any[]) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:24212'
  
  const feed = new RSS({
    title: "Kocouratci RSS Feed",
    description: "Personal RSS Feed for Torrents",
    feed_url: `${baseUrl}/api/rss`,
    site_url: baseUrl,
    language: 'en',
    pubDate: new Date(),
    ttl: 60
  })

  items.forEach(item => {
    feed.item({
      title: item.title,
      description: item.title, // or any other description you want to add
      url: item.link,
      guid: item._id.toString(),
      date: new Date(item.date)
    })
  })

  return feed.xml({ indent: true })
}

export async function GET() {
  try {
    await connectDB()
    const feeds = await Feed.find().sort({ date: -1 })
    
    const rssXml = generateRSSFeed(feeds)
    
    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'max-age=0, s-maxage=60',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return NextResponse.json(
      { error: 'Failed to generate RSS feed' },
      { status: 500 }
    )
  }
} 