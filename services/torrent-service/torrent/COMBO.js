import { torrent1337x } from './1337x.js';
import { nyaaSI } from './nyaaSI.js';
import { yts } from './yts.js';
import { pirateBay } from './pirateBay.js';
import { torLock } from './torLock.js';
import { ezTV } from './ezTV.js';
import torrentGalaxy from './torrentGalaxy.js';
import rarbg from './rarbg.js';
import { zooqle } from './zooqle.js';
import kickAss from './kickAss.js';
import bitSearch from './bitSearch.js';
import glodls from './gloTorrents.js';
import magnet_dl from './magnet_dl.js';
import limeTorrent from './limeTorrent.js';
import torrentFunk from './torrentFunk.js';
import torrentProject from './torrentProject.js';

async function combo(query, page) {
    const sources = [
        { fn: torrentGalaxy, key: 'tgx' },
        { fn: nyaaSI, key: 'nyaasi' },
        { fn: yts, key: 'yts' },
        { fn: pirateBay, key: 'piratebay' },
        { fn: torLock, key: 'torlock' },
        { fn: ezTV, key: 'eztv' },
        { fn: torrent1337x, key: '1337x' },
        { fn: rarbg, key: 'rarbg' },
        { fn: zooqle, key: 'zql' },
        { fn: kickAss, key: 'kick' },
        { fn: bitSearch, key: 'bts' },
        { fn: glodls, key: 'glo' },
        { fn: magnet_dl, key: 'mg_dl' },
        { fn: limeTorrent, key: 'lmt' },
        { fn: torrentFunk, key: 'tfk' },
        { fn: torrentProject, key: 'tpj' }
    ];

    const results = await Promise.all(
        sources.map(({ fn }) => fn(query, page))
    );

    return results.filter(result => result !== null && result.length > 0);
}

export default combo;