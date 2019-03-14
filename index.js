const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
 
(async () => {
  const browser = await puppeteer.launch({
      headless: false
  });
//   take screenshot automatically with auto input text to website
  let page = await browser.newPage();
  await page.goto('https://google.com');
  await page.type('input[aria-label="Search"]', 'Kathirr007', {delay:100});
  await page.keyboard.press('Enter');
  await page.waitForNavigation();
  await page.screenshot({path: 'example.png'});
  
  /* Creating a DPF from the website */
  //   let page = await browser.newPage();
  await page.emulate(devices['iPhone X'])
  await page.goto('https://best.aliexpress.com/?lan=en');
  await page.pdf({
      path: './page.pdf',
      format: "A4"
  });
  let title = await page.title()
  let url = await page.url()
  console.log(`Title of the page is "${title}"`)
  console.log(`URL of the page is "${url}"`)
 
//   await browser.close();
})();