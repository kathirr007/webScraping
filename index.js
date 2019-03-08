const request = require('request');
const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const fsPath = require('fs-path');
const Json2csvParser = require('json2csv').Parser;
 
const URLS = [
                {
                    url: 'https://www.imdb.com/title/tt4154664/?ref_=india_t_glfull',
                    id: '01'
                },
                {
                    url: 'https://www.imdb.com/title/tt8130968/?ref_=india_t_glfull',
                    id: '02'
                }
            ];

(async () => {
    let moviesData = [];

    
    for(let movie of URLS){
        const response = await requestPromise({
            uri: movie.url,
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,nl;q=0.8,fr;q=0.7,da;q=0.6,ta;q=0.5,el;q=0.4,de;q=0.3,fi;q=0.2,sv;q=0.1,it;q=0.1,pt;q=0.1,pl;q=0.1,es;q=0.1',
                'cache-control': 'max-age=0',
                'referer': 'https://www.imdb.com/title/tt6107548/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=ceacbc54-8ce5-43f8-a87b-7e1ff8a0ba94&pf_rd_r=25APM977GEM0DVMPDACF&pf_rd_s=hero&pf_rd_t=15061&pf_rd_i=homepage&ref_=hm_hp_cap_pri_2',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
            },
            gzip: true
        });
    
        let $ = cheerio.load(response);
    
        let title = $('.title_wrapper > h1').text().trim();
        let rating = $('.ratingValue > strong > span').text().trim();
        let poster = $('.poster > a > img').attr('src');
        let totalRatings = $('.imdbRating > a').text();
        let releaseDate = $('a[title="See more release dates"]').text().trim();

        let genres = [];
        $('.title_wrapper a[href^="/search/title"]').each((i, elm) => {
            let genre = $(elm).text();

            genres.push(genre);
        })

        moviesData.push({
            title,
            rating,
            poster,
            totalRatings,
            releaseDate,
            genres
        })

        let file = fs.createWriteStream(`${movie.id}.jpg`);

        await new Promise((resolve, reject) => {
            let stream = request({
                url: poster,
                headers: {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9,nl;q=0.8,fr;q=0.7,da;q=0.6,ta;q=0.5,el;q=0.4,de;q=0.3,fi;q=0.2,sv;q=0.1,it;q=0.1,pt;q=0.1,pl;q=0.1,es;q=0.1',
                    'cache-control': 'max-age=0',
                    'upgrade-insecure-requests': '1',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
                },
                gzip: true
            }).pipe(file)
            .on('finish', () => {
                console.log(`${movie.id} has finished downloading the image.`);
                resolve();
            })
            .on('err', (err) => {
                reject(err);
            })

        })
        .catch(err => {
            console.log(`${movie.id} has an error on download. ${err}`)
        });

    }
    
    // fs.writeFileSync('./temp/data.json', JSON.stringify(moviesData), 'utf-8');
    let filePath = './temp/';
    let jsonFileName = 'data.json';
    let csvFileName = 'data.csv';
    const json2csvParser = new Json2csvParser();
    const csv = json2csvParser.parse(moviesData);
    // Write data as JSON data
    fsPath.writeFile(`${filePath}${jsonFileName}`, JSON.stringify(moviesData), 'utf-8', function(err){
        console.log(`The file "${jsonFileName}" is written to the path "${filePath}".`);
      });
    // Write data as CSV data
    fsPath.writeFile(`${filePath}${csvFileName}`, csv, 'utf-8', function(err){
        console.log(`The file "${csvFileName}" is written to the path "${filePath}".`);
      });
})();