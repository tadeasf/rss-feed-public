import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function ezTV(query) {
    try {
        const url = 'https://eztv.re/search/' + query;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const allTorrents = [];

        $('tbody tr').each((_, element) => {
            const url = $(element).find('td').eq(1).find('a').attr('href') || '';
            const name = $(element).find('td').eq(1).find('a').text() || '';
            
            if (url !== '' || name !== '') {
                const torrent = {
                    'Name': name,
                    'Size': $(element).find('td').eq(3).text(),
                    'DateUploaded': $(element).find('td').eq(4).text(),
                    'Seeders': $(element).find('td').eq(5).text() || '',
                    'Url': "https://eztv.io" + url,
                    'Torrent': $(element).find('td').eq(2).find('a').eq(1).attr('href'),
                    'Magnet': $(element).find('td').eq(2).find('a').attr('href')
                };
                allTorrents.push(torrent);
            }
        });

        return allTorrents;
    } catch (error) {
        return handleError(error, 'ezTV');
    }
}

export { ezTV };
