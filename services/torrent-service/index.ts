import express, { Request, Response } from 'express'
import cors from 'cors'
import TorrentSearchApi from 'torrent-search-api'

const app = express()
const port = process.env.TORRENT_SERVICE_PORT || 3001

app.use(cors())
app.use(express.json())

TorrentSearchApi.enablePublicProviders();
// Initialize torrent search on startup
try {
  const providers = TorrentSearchApi.getProviders()
  console.log('Providers');
  console.log(providers);
} catch (error) {
  console.error('Failed to initialize torrent providers:', error)
}

app.get('/providers', (_req: Request, res: Response) => {
  try {
    const providers = TorrentSearchApi.getActiveProviders()
    res.json(providers)
  } catch (error) {
    console.error('Provider error:', error)
    res.status(500).json({ error: 'Failed to get providers' })
  }
})

interface SearchRequest extends Request {
  body: {
    query: string
    category?: string
    limit?: number
  }
}

app.post('/search', async (req: SearchRequest, res: Response) => {
  try {
    const { query, category = 'All', limit = 20 } = req.body
    
    const normalizedCategory = category === 'All' ? 'All' : 
      category.toLowerCase().includes('movie') ? 'Movies' :
      category.toLowerCase().includes('tv') ? 'TV' :
      category.toLowerCase().includes('music') ? 'Music' :
      category.toLowerCase().includes('game') ? 'Games' :
      category.toLowerCase().includes('software') ? 'Apps' : 'All'
    
    const results = await TorrentSearchApi.search(query, normalizedCategory, limit)
    res.json(results)
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Search failed',
      details: error instanceof Error ? error.stack : String(error)
    })
  }
})

app.listen(port, () => {
  console.log(`Torrent service listening at http://localhost:${port}`)
}) 