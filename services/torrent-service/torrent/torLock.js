import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function torLock(query = '', page = '1') {
    try {
        const url = encodeURI('https://www.torlock.com/all/torrents/' + query + '/' + page + '.html');
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const ALLTORRENT = [];
        const ALLURL = [];

        $('.table tbody tr').each((rowIndex, element) => {
            if (rowIndex > 3) {
                const url = "https://www.torlock.com" + $(element).find('td').eq(0).find('div a').attr('href');
                ALLURL.push(url);
                const torrent = {
                    'Name': $(element).find('td').eq(0).find('div a b').text().trim(),
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
                        ALLTORRENT[i].Torrent = $("body > article > div:nth-child(6) > div > div:nth-child(2) > a").attr('href') || "";
                        ALLTORRENT[i].Magnet = $('body > article > table:nth-child(5) > thead > tr > th > div:nth-child(2) > h4 > a:nth-child(1)').attr('href');
                    } catch {
                        // Skip failed requests for individual torrents
                        continue;
                    }
                }
            }
        }));

        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'torLock');
    }
}

export { torLock };