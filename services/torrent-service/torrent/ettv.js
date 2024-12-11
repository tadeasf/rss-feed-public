import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function ettvCentral(query, page = '0') {
    try {
        const url = "https://www.ettvcentral.com/torrents-search.php?search=" + query + "&page=" + page;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const ALLTORRENT = [];
        const ALLURLARRAY = [];

        $('table tbody').each((index, element) => {
            $('tr').each((i, el) => {
                const data = {
                    Name: $(el).find('td').eq(1).find('a b').text(),
                    Category: $(el).find('td').eq(0).find('a img').attr('title'),
                    DateUploaded: $(el).find('td').eq(2).text(),
                    Size: $(el).find('td').eq(3).text(),
                    Seeders: $(el).find('td').eq(5).text(),
                    Leechers: $(el).find('td').eq(6).text(),
                    UploadedBy: $(el).find('td').eq(7).text(),
                    Url: "https://www.ettvcentral.com" + $(el).find('td').eq(1).find('a').attr('href')
                };
                
                if (data.Name !== '') {
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
                        
                        ALLTORRENT[i].Poster = $('div .torrent_data').find('center img').attr('src') || '';
                        ALLTORRENT[i].Magnet = $("#downloadbox > table > tbody > tr > td:nth-child(1) > a").attr('href');
                    } catch {
                        // Skip failed requests for individual torrents
                        continue;
                    }
                }
            }
        }));

        return ALLTORRENT;
    } catch (error) {
        return handleError(error, 'ettvCentral');
    }
}

export default ettvCentral;