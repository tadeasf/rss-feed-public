import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function torrentProject(query, page = '0') {
    try {
        const url = `https://torrentproject2.com/?t=${query}&p=${page}&orderby=seeders`;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const ALLTORRENT = [];
        const ALLURL = [];

        $('.tt').each((_, element) => {
            const url = "https://torrentproject2.com" + $(element).find('a').attr('href');
            ALLURL.push(url);
            
            const torrent = {
                'Name': $(element).find('a').text(),
                'Size': $(element).find('span.bc').text(),
                'Seeders': $(element).find('span.bc span').eq(0).text(),
                'Leechers': $(element).find('span.bc span').eq(1).text(),
                'DateUploaded': $(element).find('span.bc').next().text(),
                'Url': url
            };
            
            if (torrent.Name !== '') {
                ALLTORRENT.push(torrent);
            }
        });

        await Promise.all(ALLURL.map(async url => {
            for (let i = 0; i < ALLTORRENT.length; i++) {
                if (ALLTORRENT[i].Url === url) {
                    try {
                        const html = await axios.get(url, axiosConfig);
                        const $ = cheerio.load(html.data);
                        let magnet = $('.usite a').attr('href');
                        let startMagnetIdx = magnet.indexOf('magnet');
                        magnet = magnet.slice(startMagnetIdx);
                        ALLTORRENT[i].Magnet = decodeURIComponent(magnet);
                    } catch {
                        // Skip failed requests for individual torrents
                        continue;
                    }
                }
            }
        }));

        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'torrentProject');
    }
}

export default torrentProject;