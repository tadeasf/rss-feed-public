import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function nyaaSI(query, page = '1') {
    try {
        const url = 'https://nyaa.si/?f=0&c=0_0&q=' + query + '&p=' + page;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const torrents = [];

        const regex = /.comments/gi;
        const nameRegex = /[a-zA-Z\W].+/g;

        $('tbody tr').each((_, element) => {
            const $find = $(element);
            const td = $find.children('td');
            
            const data = {
                Name: $find.find('td[colspan="2"] a').text().trim().match(nameRegex)[0],
                Category: $find.find('a').attr('title'),
                Url: ('https://nyaa.si' + $find.find('td[colspan="2"] a').attr('href')).replace(regex, ''),
                Size: $(td).eq(3).text(),
                DateUploaded: $(td).eq(4).text(),
                Seeders: $(td).eq(5).text(),
                Leechers: $(td).eq(6).text(),
                Downloads: $(td).eq(7).text(),
                Torrent: 'https://nyaa.si' + $find.find('.text-center a').attr('href'),
                Magnet: $find.find('.text-center a').next().attr('href')
            };
            
            torrents.push(data);
        });

        return torrents;
    } catch (error) {
        return handleError(error, 'nyaaSI');
    }
}

export { nyaaSI };