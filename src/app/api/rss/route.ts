import { NextResponse } from 'next/server'
import { Feed } from '@/models/Feed'
import connectDB from '@/lib/mongodb'

function generateRSSFeed(items: any[]) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:26017'
  
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kocouřátčí RSS Feed</title>
    <description>Personal RSS Feed for Torrents</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="false">${item._id.toString()}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`
}

export async function GET() {
  try {
    await connectDB()
    const feeds = await Feed.find().sort({ date: -1 })
    
    const rssXml = generateRSSFeed(feeds)
    
    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=0, s-maxage=60', // Cache for 1 minute on CDN
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