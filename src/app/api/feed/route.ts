import { NextResponse } from 'next/server'
import { Feed } from '@/models/Feed'
import connectDB from '@/lib/mongodb'
import { toMagnetURI } from 'parse-torrent'
import { headers } from 'next/headers'
import parseTorrent from 'parse-torrent'

// Move trackers to a separate config file
const defaultTrackers = [
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://tracker.openbittorrent.com:6969/announce',
  'udp://wambo.club:1337/announce',
  'udp://tracker.dutchtracking.com:6969/announce',
  'udp://tc.animereactor.ru:8082/announce',
  'udp://tracker.uw0.xyz:6969/announce',
  'udp://tracker.kamigami.org:2710/announce',
  'http://tracker.files.fm:6969/announce',
  'udp://opentracker.i2p.rocks:6969/announce',
  'udp://tracker.zerobytes.xyz:1337/announce',
  'https://tracker.nitrix.me:443/announce',
  'http://novaopcj.icu:10325/announce',
  'udp://aaa.army:8866/announce',
  'https://tracker.imgoingto.icu:443/announce',
  'udp://tracker.shkinev.me:6969/announce',
  'udp://blokas.io:6969/announce',
  'udp://api.bitumconference.ru:6969/announce',
  'udp://ln.mtahost.co:6969/announce',
  'udp://vibe.community:6969/announce',
  'udp://tracker.vulnix.sh:6969/announce',
  'udp://wassermann.online:6969/announce',
  'udp://kanal-4.de:6969/announce',
  'udp://mts.tvbit.co:6969/announce',
  'udp://adminion.n-blade.ru:6969/announce',
  'udp://benouworldtrip.fr:6969/announce',
  'udp://sd-161673.dedibox.fr:6969/announce',
  'udp://47.ip-51-68-199.eu:6969/announce',
  'udp://cdn-1.gamecoast.org:6969/announce',
  'udp://daveking.com:6969/announce',
  'http://rt.tace.ru:80/announce',
  'udp://forever-tracker.zooki.xyz:6969/announce',
  'udp://free-tracker.zooki.xyz:6969/announce',
  'udp://tracker.publictracker.xyz:6969/announce',
  'udp://tracker.skynetcloud.site:6969/announce',
  'udp://tracker.altrosky.nl:6969/announce',
  'http://5rt.tace.ru:60889/announce',
  'https://tracker.lilithraws.cf:443/announce',
  'http://tracker.sakurato.xyz:23333/announce',
  'udp://open.stealth.si:80/announce',
  'udp://zephir.monocul.us:6969/announce',
  'http://tracker2.itzmx.com:6961/announce',
  'http://tracker3.itzmx.com:6961/announce',
  'http://h4.trakx.nibba.trade:80/announce',
  'udp://line-net.ru:6969/announce',
  'udp://tracker.dyne.org:6969/announce',
  'udp://mail.realliferpg.de:6969/announce',
  'udp://storage.groupees.com:6969/announce',
  'udp://torrent.tdjs.tech:6969/announce',
  'udp://tracker.v6speed.org:6969/announce',
  'udp://cdn-2.gamecoast.org:6969/announce',
  'udp://bms-hosxp.com:6969/announce',
  'udp://teamspeak.value-wolf.org:6969/announce',
  'udp://koli.services:6969/announce',
  'udp://inferno.demonoid.is:3391/announce',
  'udp://ipv4.tracker.harry.lu:80/announce',
  'udp://tracker.cyberia.is:6969/announce',
  'udp://tracker.ds.is:6969/announce',
  'udp://retracker.akado-ural.ru:80/announce',
  'udp://discord.heihachi.pw:6969/announce',
  'udp://chanchan.uchuu.co.uk:6969/announce',
  'udp://aruacfilmes.com.br:6969/announce',
  'udp://edu.uifr.ru:6969/announce',
  'udp://publictracker.xyz:6969/announce',
  'udp://www.torrent.eu.org:451/announce',
  'http://vps02.net.orel.ru:80/announce',
  'udp://bt2.archive.org:6969/announce',
  'http://tracker.noobsubs.net:80/announce',
  'udp://tracker.zum.bi:6969/announce',
  'udp://dpiui.reedlan.com:6969/announce',
  'udp://engplus.ru:6969/announce',
  'udp://ultra.zt.ua:6969/announce',
  'udp://nagios.tks.sumy.ua:80/announce',
  'udp://61626c.net:6969/announce',
  'udp://t2.leech.ie:1337/announce',
  'https://trakx.herokuapp.com:443/announce',
  'udp://bt1.archive.org:6969/announce',
  'https://tracker.tamersunion.org:443/announce',
  'udp://t1.leech.ie:1337/announce',
  'udp://us-tracker.publictracker.xyz:6969/announce',
  'udp://tracker.tiny-vps.com:6969/announce',
  'udp://tracker.dler.org:6969/announce',
  'http://t.nyaatracker.com:80/announce',
  'udp://t3.leech.ie:1337/announce',
  'udp://3rt.tace.ru:60889/announce',
  'udp://retracker.lanta-net.ru:2710/announce',
  'udp://valakas.rollo.dnsabr.com:2710/announce',
  'udp://rutorrent.frontline-mod.com:6969/announce',
  'udp://tracker.torrent.eu.org:451/announce',
  'udp://opentor.org:2710/announce',
  'udp://adm.category5.tv:6969/announce',
  'udp://tracker.army:6969/announce',
  'udp://tracker2.dler.org:80/announce',
  'udp://tracker.fortu.io:6969/announce',
  'http://bt.3kb.xyz:80/announce',
  'udp://explodie.org:6969/announce',
  'https://1337.abcvg.info:443/announce',
  'udp://tracker0.ufibox.com:6969/announce',
  'udp://movies.zsw.ca:6969/announce',
  'udp://code2chicken.nl:6969/announce',
  'udp://u.wwwww.wtf:1/announce',
  'udp://tracker.0x.tf:6969/announce',
  'http://publictracker.ch:6969/announce',
  'udp://bioquantum.co.za:6969/announce',
  'udp://www.midea123.z-media.com.cn:6969/announce',
  'http://retracker.sevstar.net:2710/announce',
  'udp://tracker.blacksparrowmedia.net:6969/announce',
  'udp://git.vulnix.sh:6969/announce',
  'udp://admin.videoenpoche.info:6969/announce'
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
 
async function addToFeed(input: string | { magnet: string, title?: string }): Promise<any> {
  let magnet: string
  let title: string | undefined

  if (typeof input === 'string') {
    // Handle info hash case
    if (input.startsWith('magnet:')) {
      magnet = input
      // Try to extract title from magnet URI
      const parsed = parseTorrent(magnet)
      title = typeof parsed?.name === 'string' ? parsed.name : undefined
    } else {
      // It's an info hash, generate magnet URI
      magnet = toMagnetURI({
        infoHash: input,
        announce: defaultTrackers
      })
    }
  } else {
    // Handle search result case
    magnet = input.magnet
    title = input.title
  }

  await connectDB()
  const feed = new Feed({
    title: title || `Torrent-${magnet.split('btih:')[1]?.substring(0, 6)}`,
    link: magnet,
    date: new Date()
  })

  await feed.save()
  return feed
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

interface FeedPostBody {
  infoHash?: string
  title?: string
  magnets?: string[]
  torrents?: Array<{
    magnet: string
    title: string
  }>
}

export async function POST(request: Request) {
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
    const body = await request.json() as FeedPostBody
    let inputs: Array<string | { magnet: string, title?: string }>

    if (body.torrents?.length) {
      // Handle search results
      inputs = body.torrents
    } else if (body.infoHash) {
      // Handle single info hash with optional title
      inputs = [{ magnet: body.infoHash, title: body.title }]
    } else if (body.magnets?.length) {
      // Handle array of magnet links
      inputs = body.magnets
    } else {
      throw new Error('No valid magnet links or info hashes provided')
    }

    const results = await Promise.all(
      inputs.map(input => addToFeed(input))
    )
    
    return NextResponse.json({ success: true, count: results.length })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add to feed' },
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
