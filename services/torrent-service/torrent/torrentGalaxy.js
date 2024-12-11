import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function torrentGalaxy(query = '', page = '0') {
    try {
        if (page !== '0') {
            page = Number(page) - 1;
        }
        
        const url = "https://torrentgalaxy.to/torrents.php?search=" + query + "&sort=id&order=desc&page=" + page;
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const allTorrents = [];

        $('div.tgxtablerow.txlight').each((_, element) => {
            const data = {
                Name: $(element).find("a.txlight").text(),
                Poster: $(element).find(":nth-child(1) div a img").attr('src') || "",
                Category: $(element).find(":nth-child(1) a small").text(),
                Url: "https://torrentgalaxy.to" + $(element).find("a.txlight").attr('href'),
                UploadedBy: $(element).find(':nth-child(7) span a span').text(),
                Size: $(element).find(':nth-child(8)').text(),
                Seeders: $(element).find(':nth-child(11) span font:nth-child(1)').text(),
                Leechers: $(element).find(':nth-child(11) span font:nth-child(2)').text(),
                DateUploaded: $(element).find(":nth-child(12)").text(),
                Torrent: $(element).find(".tgxtablecell.collapsehide.rounded.txlight a").attr("href"),
                Magnet: $(element).find(".tgxtablecell.collapsehide.rounded.txlight a").next().attr("href")
            };
            
            allTorrents.push(data);
        });
        
        return allTorrents;
    } catch (error) {
        return handleError(error, 'torrentGalaxy');
    }
}

export default torrentGalaxy;