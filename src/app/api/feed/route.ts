import { NextResponse } from 'next/server'
import { Feed } from '@/models/Feed'
import connectDB from '@/lib/mongodb'
import { toMagnetURI } from 'parse-torrent'
import { headers } from 'next/headers'
import parseTorrent from 'parse-torrent'

// Move trackers to a separate config file
const defaultTrackers = [
  'udp://wambo.club:1337/announce',
  'udp://tracker.dutchtracking.com:6969/announce',
  'udp://tc.animereactor.ru:8082/announce'
]

async function validateBasicAuth() {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization) {
    return false
  }

  const auth = authorization.split(' ')[1]
  const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')

  return user === process.env.USERNAME && pwd === process.env.PASSWORD
}

export async function GET() {
  if (!await validateBasicAuth()) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { 
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        }
      }
    )
  }

  try {
    await connectDB()
    const feeds = await Feed.find().sort({ date: -1 })
    return NextResponse.json(feeds)
  } catch (error) {
    console.error('Error fetching feeds:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feeds' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  if (!await validateBasicAuth()) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { 
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        }
      }
    )
  }

  let body;
  
  try {
    if (!req.body) {
      return NextResponse.json(
        { error: 'Request body is empty' },
        { status: 400 }
      )
    }
    
    body = await req.json()
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }

  try {
    const { infoHash } = body
    
    if (!infoHash) {
      return NextResponse.json(
        { error: 'Info hash is required' },
        { status: 400 }
      )
    }

    if (!/^[a-fA-F0-9]{40}$/.test(infoHash)) {
      return NextResponse.json(
        { error: 'Invalid info hash format' },
        { status: 400 }
      )
    }

    // Generate magnet URI with trackers
    const magnetUri = toMagnetURI({
      infoHash: infoHash.toLowerCase(),
      announce: defaultTrackers,
      name: infoHash // temporary name
    })

    // Parse the magnet URI to get metadata
    const parsed = parseTorrent(magnetUri)
    const title = parsed.name || `Torrent-${infoHash.substring(0, 8)}`

    await connectDB()
    const feed = await Feed.create({
      title,
      link: magnetUri,
      date: new Date()
    })

    return NextResponse.json(feed)
  } catch (error) {
    console.error('Error creating feed:', error)
    return NextResponse.json(
      { error: 'Failed to create feed' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  if (!await validateBasicAuth()) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { 
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        }
      }
    )
  }

  try {
    await connectDB()
    await Feed.deleteMany({})
    return NextResponse.json({ message: 'All feeds deleted successfully' })
  } catch (error) {
    console.error('Error deleting feeds:', error)
    return NextResponse.json(
      { error: 'Failed to delete feeds' },
      { status: 500 }
    )
  }
} 