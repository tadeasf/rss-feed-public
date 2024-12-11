import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function rarbg(query, page = '1') {
    try {
        const url = "https://rargb.to/search/" + page + "/?search=" + query;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const ALLTORRENT = [];
        const ALLURLARRAY = [];

        $('table.lista2t tbody').each((index, element) => {
            $('tr.lista2').each((i, el) => {
                const td = $(el).children('td');
                const data = {
                    Name: $(td).eq(1).find('a').attr('title'),
                    Category: $(td).eq(2).find('a').text(),
                    DateUploaded: $(td).eq(3).text(),
                    Size: $(td).eq(4).text(),
                    Seeders: $(td).eq(5).find('font').text(),
                    Leechers: $(td).eq(6).text(),
                    UploadedBy: $(td).eq(7).text(),
                    Url: "https://rargb.to" + $(td).eq(1).find('a').attr('href')
                };
                
                if (data.Name) {
                    ALLURLARRAY.push(data.Url);
                    ALLTORRENT.push(data);
                }
            });
        });

        await Promise.all(ALLURLARRAY.map(async (url) => {
            for (let i = 0; i < ALLTORRENT.length; i++) {
                if (ALLTORRENT[i].Url === url) {
                    try {
                        const html = await axios.get(url, axiosConfig);
                        const $ = cheerio.load(html.data);
                        
                        const poster = "https://rargb.to" + $("tr:nth-child(4) > td:nth-child(2) > img:nth-child(1)").attr('src');
                        ALLTORRENT[i].Poster = !poster.endsWith('undefined') ? poster : '';
                        ALLTORRENT[i].Magnet = $("tr:nth-child(1) > td:nth-child(2) > a:nth-child(3)").attr('href');
                    } catch {
                        // Skip failed requests for individual torrents
                        continue;
                    }
                }
            }
        }));

        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'rarbg');
    }
}

export default rarbg;