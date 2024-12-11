import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function bitSearch(query, page = '1') {
    const ALLTORRENT = [];
    const url = "https://bitsearch.to/search?q=" + query + "&page=" + page + "&sort=seeders";
    
    try {
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);

        $('div.search-result.view-box').each((_, element) => {
            let torrent = {
                'Name': $(element).find('.info h5 a').text().trim(),
                'Size': $(element).find('.info div div').eq(2).text().trim(),
                'Downloads': $(element).find('.info div div').eq(1).text().trim(),
                'Seeders': $(element).find('.info div div').eq(3).text().trim(),
                'Leechers': $(element).find('.info div div').eq(4).text().trim(),
                'DateUploaded': $(element).find('.info div div').eq(5).text().trim(),
                'Url': "https://bitsearch.to" + $(element).find('.info h5 a').attr('href'),
                'TorrentLink': $(element).find('.links a').attr('href'),
                'Magnet': $(element).find('.links a').next().attr('href'),
            }
            ALLTORRENT.push(torrent);
        });

        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'bitSearch');
    }
}

export default bitSearch;