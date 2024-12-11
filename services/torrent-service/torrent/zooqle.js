import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function zooqle(query = '', page = '1') {
    try {
        const url = "https://zooqle.com/search?pg=" + page + "&q=" + query;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const ALLTORRENT = [];

        $('tbody tr').each((_, element) => {
            let seeders_leechers = $(element).find('td').eq(5).find('div').attr('title').trim().split('|');
            let seeders = seeders_leechers[0].replace('Seeders:', '').trim();
            let leechers = seeders_leechers[1].replace('Leechers:', '').trim();

            const torrent = {
                'Name': $(element).find('td').eq(1).find('a').text().trim(),
                'Size': $(element).find('td').eq(3).find('div div').text().trim(),
                'DateUploaded': $(element).find('td').eq(4).text().trim(),
                'Seeders': seeders,
                'Leechers': leechers,
                'Url': "https://zooqle.com" + $(element).find('td').eq(1).find('a').attr('href'),
                'Magnet': $(element).find('td').eq(2).find('ul').find('li').eq(1).find('a').attr('href')
            };
            
            if (torrent.Name !== '') {
                ALLTORRENT.push(torrent);
            }
        });
        
        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'zooqle');
    }
}

export { zooqle };