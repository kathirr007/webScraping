const puppeteer = require('puppeteer');

let browser = null
let page = null

/* constants */
const BASE_URL = 'https://amazon.com'

const amazon = {
    initialize: async () => {
        console.log('Starting the scraper...')
        browser = await puppeteer.launch({
            headless: false
        });
        page = await browser.newPage();
        await page.goto(BASE_URL, {
            waitUntil: 'networkidle2'
        })
        console.log('Initialization is completed...')
    },
    
    end: async () => {
        console.log('Initialization is completed...')
        await browser.close();
      }
}
 


  module.exports = amazon;