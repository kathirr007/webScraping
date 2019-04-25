const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

 
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    let page = await browser.newPage();

    await page.setRequestInterception(true)

    page.on('request', (request) => {
        if(['image', 'stylesheet', 'font'].includes(request.resourceType())) {
            request.abort()
        } else {
            request.continue()
        }
    })

    await page.goto('https://www.amazon.com')

    debugger;

   
  //   await browser.close();
  })();