import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Import scrapers
const scrapers = {
    '1337x': (await import('./torrent/1337x.js')).torrent1337x,
    'nyaasi': (await import('./torrent/nyaaSI.js')).nyaaSI,
    'yts': (await import('./torrent/yts.js')).yts,
    'piratebay': (await import('./torrent/pirateBay.js')).pirateBay,
    'torlock': (await import('./torrent/torLock.js')).torLock,
    'eztv': (await import('./torrent/ezTV.js')).ezTV,
    'tgx': (await import('./torrent/torrentGalaxy.js')).default,
    'rarbg': (await import('./torrent/rarbg.js')).default,
    'zooqle': (await import('./torrent/zooqle.js')).zooqle,
    'kickass': (await import('./torrent/kickAss.js')).default,
    'bitsearch': (await import('./torrent/bitSearch.js')).default,
    'glodls': (await import('./torrent/gloTorrents.js')).default,
    'magnetdl': (await import('./torrent/magnet_dl.js')).default,
    'limetorrent': (await import('./torrent/limeTorrent.js')).default,
    'torrentfunk': (await import('./torrent/torrentFunk.js')).default,
    'torrentproject': (await import('./torrent/torrentProject.js')).default,
    'all': (await import('./torrent/COMBO.js')).default
};

// Page limits for specific providers
const PAGE_LIMITS = {
    '1337x': 50,
    'nyaasi': 14
};

app.use(express.static(path.join(__dirname, 'public')));

const handleTorrentResponse = (data, query, res) => {
    if (data === null) {
        return res.json({ error: 'Website is blocked change IP' });
    } 
    if (data.length === 0) {
        return res.json({ error: 'No search result available for query (' + query + ')' });
    }
    return res.send(data);
};

app.use('/api/:website/:query/:page?', (req, res) => {
    const { website, query, page } = req.params;
    const scraper = scrapers[website.toLowerCase()];

    // Check if website is supported
    if (!scraper) {
        return res.json({
            error: `Please select one of: ${Object.keys(scrapers).join(' | ')}`
        });
    }

    // Check page limits
    const pageLimit = PAGE_LIMITS[website];
    if (pageLimit && page > pageLimit) {
        return res.json({
            error: `Please enter page value less than ${pageLimit + 1} to get the result :)`
        });
    }

    // Execute scraper
    scraper(query, page).then(data => handleTorrentResponse(data, query, res));
});

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
console.log('Listening on PORT:', PORT);
app.listen(PORT);

export default app;
