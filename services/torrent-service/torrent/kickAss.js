import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function kickAss(query, page = '1') {
    try {
        const url = "https://kickasstorrents.to/usearch/" + query + "/" + page + "/";
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const ALLTORRENT = [];
        const ALLURL = [];

        $('tbody tr').each((i, element) => {
            if (i > 2) {
                const url = "https://kickasstorrents.to" + $(element).find('a.cellMainLink').attr('href');
                if (!url.endsWith('undefined')) {
                    ALLURL.push(url);
                    const torrent = {
                        "Name": $(element).find('a.cellMainLink').text().trim(),
                        "Size": $(element).find('td').eq(1).text().trim(),
                        "UploadedBy": $(element).find('td').eq(2).text().trim(),
                        "Age": $(element).find('td').eq(3).text().trim(),
                        "Seeders": $(element).find('td').eq(4).text().trim(),
                        "Leechers": $(element).find('td').eq(5).text().trim(),
                        "Url": url
                    };
                    ALLTORRENT.push(torrent);
                }
            }
        });

        await Promise.all(ALLURL.map(async (url) => {
            for (let i = 0; i < ALLTORRENT.length; i++) {
                if (ALLTORRENT[i].Url === url) {
                    try {
                        const html = await axios.get(url, axiosConfig);
                        const $ = cheerio.load(html.data);
                        ALLTORRENT[i].Magnet = $('a.kaGiantButton').attr('href');
                    } catch {
                        // Skip failed requests for individual torrents
                        continue;
                    }
                }
            }
        }));

        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'kickAss');
    }
}

export default kickAss;