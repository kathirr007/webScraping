const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

 
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--proxy-server=128.199.154.45:8080']
    });
    let page = await browser.newPage();
    await page.goto('https://httpbin.org/ip')

    debugger;

   
  //   await browser.close();
  })();