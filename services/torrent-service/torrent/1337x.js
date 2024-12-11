import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function torrent1337x(query = '', page = '1') {
    try {
        const url = 'https://1337xx.to/search/' + query + '/' + page + '/';
        const html = await axios.get(url, axiosConfig);
        const allTorrent = [];
        const $ = cheerio.load(html.data);

        const links = $('td.name').map((_, element) => {
            return 'https://1337xx.to' + $(element).find('a').next().attr('href');
        }).get();

        await Promise.all(links.map(async (element) => {
            try {
                const html = await axios.get(element, axiosConfig);
                const $ = cheerio.load(html.data);
                const data = {};
                const labels = ['Category', 'Type', 'Language', 'Size', 'UploadedBy', 'Downloads', 'LastChecked', 'DateUploaded', 'Seeders', 'Leechers'];
                
                data.Name = $('.box-info-heading h1').text().trim();
                data.Magnet = $('.clearfix ul li a').attr('href') || "";
                const poster = $('div.torrent-image img').attr('src');
                data.Poster = poster ? (poster.startsWith('http') ? poster : 'https:' + poster) : '';
                data.Url = element;

                $('div .clearfix ul li > span').each((i, element) => {
                    data[labels[i]] = $(element).text();
                });

                allTorrent.push(data);
            } catch {
                // Skip failed requests for individual torrents
                return null;
            }
        }));

        return allTorrent;
    } catch (error) {
        return handleError(error, '1337x');
    }
}

export { torrent1337x };