const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

 
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        defaultViewport: {
            width: 1366,
            height: 768
        }
    });
    let page = await browser.newPage();

    await page.goto('https://google.com')

    debugger;

   
  //   await browser.close();
  })();