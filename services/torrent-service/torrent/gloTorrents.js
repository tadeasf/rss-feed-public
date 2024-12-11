import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function glodls(query, page = '0') {
    try {
        const url = `https://glodls.to/search_results.php?search=${query}&sort=seeders&order=desc&page=${page}`;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const ALLTORRENT = [];

        $('.ttable_headinner tr').each((_, element) => {
            const torrent = {
                'Name': $(element).find('td').eq(1).find('a').text().trim(),
                'Size': $(element).find('td').eq(4).text(),
                'UploadedBy': $(element).find('td').eq(7).find('a b font').text(),
                'Seeders': $(element).find('td').eq(5).find('font b').text(),
                'Leechers': $(element).find('td').eq(6).find('font b').text(),
                'Url': "https://glodls.to" + $(element).find('td').eq(1).find('a').next().attr('href'),
                'Torrent': "https://glodls.to" + $(element).find('td').eq(2).find('a').attr('href'),
                'Magnet': $(element).find('td').eq(3).find('a').attr('href')
            };
            if (torrent.Name !== '') {
                ALLTORRENT.push(torrent);
            }
        });
        
        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'glodls');
    }
}

export default glodls;
