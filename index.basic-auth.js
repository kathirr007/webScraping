const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

 
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    let page = await browser.newPage();

    page.authenticate({username: 'kathir', password: '123456'})
    
    await page.goto('https://httpbin.org/basic-auth/kathir/123456')

    debugger;

   
  //   await browser.close();
  })();