import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function magnet_dl(query, page = '1') {
    try {
        const url = `https://www.magnetdl.com/a/${query}/se/desc/${page}/`;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const ALLTORRENT = [];

        $('.download tbody tr').each((_, element) => {
            const torrent = {
                'Name': $(element).find('td').eq(1).find('a').text().trim(),
                'Size': $(element).find('td').eq(5).text(),
                'DateUploaded': $(element).find('td').eq(2).text(),
                'Category': $(element).find('td').eq(3).text(),
                'Seeders': $(element).find('td').eq(6).text(),
                'Leechers': $(element).find('td').eq(7).text(),
                'Url': "https://www.magnetdl.com" + $(element).find('td').eq(1).find('a').attr('href'),
                'Magnet': $(element).find('td').eq(0).find('a').attr('href')
            };
            
            if (torrent.Name !== '') {
                ALLTORRENT.push(torrent);
            }
        });
        
        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'magnet_dl');
    }
}

export default magnet_dl;