import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function limeTorrent(query, page = '1') {
    try {
        const url = `https://www.limetorrents.pro/search/all/${query}/seeds/${page}/`;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const ALLTORRENT = [];

        $('.table2 tbody tr').each((i, element) => {
            if (i > 0) {
                const category_and_age = $(element).find('td').eq(1).text().trim().split('-');
                const age = category_and_age[0].trim();
                const category = category_and_age[1].replace('in', '').trim();
                
                const torrent = {
                    "Name": $(element).find('div.tt-name').text().trim(),
                    "Size": $(element).find('td').eq(2).text().trim(),
                    "Category": category,
                    "Age": age,
                    "Seeders": $(element).find('td').eq(3).text().trim(),
                    "Leechers": $(element).find('td').eq(4).text().trim(),
                    "Torrent": $(element).find('div.tt-name a').attr('href'),
                    "Url": "https://www.limetorrents.pro" + $(element).find('div.tt-name a').next().attr('href')
                };
                ALLTORRENT.push(torrent);
            }
        });
        
        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'limeTorrent');
    }
}

export default limeTorrent;