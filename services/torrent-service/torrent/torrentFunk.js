import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function torrentFunk(query) {
    try {
        const url = `https://www.torrentfunk.com/all/torrents/${query}.html`;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const ALLTORRENT = [];
        const ALLURL = [];

        $('.tmain tbody tr').each((i, element) => {
            if (i > 4) {
                const url = "https://www.torrentfunk.com" + $(element).find('td').eq(0).find('a').attr('href');
                ALLURL.push(url);
                const torrent = {
                    'Name': $(element).find('td').eq(0).find('a').text().trim(),
                    'Size': $(element).find('td').eq(2).text().trim(),
                    'DateUploaded': $(element).find('td').eq(1).text().trim(),
                    'Seeders': $(element).find('td').eq(3).text().trim(),
                    'Leechers': $(element).find('td').eq(4).text().trim(),
                    'Url': url
                };
                
                if (torrent.Name !== '') {
                    ALLTORRENT.push(torrent);
                }
            }
        });

        await Promise.all(ALLURL.map(async url => {
            for (let i = 0; i < ALLTORRENT.length; i++) {
                if (ALLTORRENT[i].Url === url) {
                    try {
                        const html = await axios.get(url, axiosConfig);
                        const $ = cheerio.load(html.data);
                        ALLTORRENT[i].Torrent = "https://www.torrentfunk.com" + 
                            $('#right > main > div.content > table:nth-child(3) > tbody > tr > td:nth-child(2) > a').attr('href');
                    } catch {
                        // Skip failed requests for individual torrents
                        continue;
                    }
                }
            }
        }));

        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'torrentFunk');
    }
}

export default torrentFunk;