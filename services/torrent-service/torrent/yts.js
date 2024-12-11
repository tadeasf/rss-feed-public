import * as cheerio from 'cheerio';
import axios from 'axios';
import { axiosConfig, handleError } from './config.js';

async function yts(query, page = '1') {
    try {
        const url = page === '' || page === '1' 
            ? "https://yts.mx/browse-movies/" + query + "/all/all/0/latest/0/all"
            : "https://yts.mx/browse-movies/" + query + "/all/all/0/latest/0/all?page=" + page;
            
        const html = await axios.get(url, axiosConfig);
        const $ = cheerio.load(html.data);
        const all = [];
        const ALLURL = [];

        $('.browse-movie-wrap').each((_, element) => {
            const url = $(element).find('a.browse-movie-link').attr('href');
            ALLURL.push(url);
            
            const data = {
                Name: $(element).find('a.browse-movie-title').text(),
                Category: "Movie",
                Poster: $(element).find('img.img-responsive').attr('src'),
                Year: $(element).find('div.browse-movie-year').text(),
                Url: url,
                Rating: $(element).find('h4.rating').text(),
                Files: []
            };
            
            if (data.Name !== '') {
                all.push(data);
            }
        });

        await Promise.all(ALLURL.map(async (url, idx) => {
            try {
                const html = await axios.get(url, axiosConfig);
                const $ = cheerio.load(html.data);
                
                $('.modal-torrent').each((_, ele) => {
                    const files = {
                        Quality: $(ele).find(':nth-child(1)').text(),
                        Type: $(ele).find(':nth-child(2)').text(),
                        Size: $(ele).find(':nth-child(3)').text(),
                        Torrent: $(ele).find(':nth-child(6)').attr('href'),
                        Magnet: $(ele).find(':nth-child(7)').attr('href')
                    };
                    all[idx].Files.push(files);
                });
            } catch {
                // Skip failed requests for individual movies
                return;
            }
        }));

        return all;
    } catch (error) {
        return handleError(error, 'yts');
    }
}

export { yts };