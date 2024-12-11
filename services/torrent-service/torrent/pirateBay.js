import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function pirateBay(query, page = '1') {
    try {
        const url = 'https://thehiddenbay.com/search/' + query + '/' + page + '/99/0';
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const allTorrents = [];

        $("table#searchResult tr").each((_, element) => {
            const data = $(element).find('font.detDesc').text()
                .replace(/(Size|Uploaded)/gi, '')
                .replace(/ULed/gi, 'Uploaded')
                .split(',')
                .map(value => value.trim());
                
            const torrent = {
                Name: $(element).find('a.detLink').text(),
                Size: data[1] || '',
                DateUploaded: data[0] || '',
                Category: $(element).find('td.vertTh center a').eq(0).text(),
                Seeders: $(element).find('td').eq(2).text(),
                Leechers: $(element).find('td').eq(3).text(),
                UploadedBy: $(element).find('font.detDesc a').text(),
                Url: $(element).find('a.detLink').attr('href'),
                Magnet: $(element).find("td div.detName").next().attr('href')
            };

            if (torrent.Name.length) {
                allTorrents.push(torrent);
            }
        });

        return allTorrents;
    } catch (error) {
        return handleError(error, 'pirateBay');
    }
}

export { pirateBay };