import puppeteer_extra from 'puppeteer-extra'
import puppeteer_extra_plugin_stealth from 'puppeteer-extra-plugin-stealth'
// puppeteer_extra_plugin_stealth.enabledEvasions.delete('console.debug')
puppeteer_extra.use(puppeteer_extra_plugin_stealth())



export async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

export async function screenshot(page, path, fullPage = true) {

  await autoScroll(page);

  page.screenshot({
    path: path,
    fullPage: fullPage
  });
  return page;

}


export async function Puppeteer() {

  const browser = await puppeteer_extra.launch({
    //  args: ['--proxy-server=http://192.168.49.1:8000']'''--disable-features=site-per-process'
    executablePath: "/usr/bin/chromium-browser",

    headless: true
    // args: ['--disable-features=site-per-process', '--no-sandbox', '--lang=en-US', '--disable-extensions', '--start-maximized'],
    // devtools: false, // dumpio: true, 
    // defaultViewport: {
    //   width: 1200,
    //   height: 800
    // }
  })

  const page = await browser.newPage().catch(
    console.error
  )


  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en'
  });
  let filtered_resources = ['font'];
  await page.setRequestInterception(true);
  // let add_data = fs.readFileSync('./lib/easylist.txt', 'utf8')
  // add_data = add_data.split('\n').map(x => x.replace('@ ', ""));
  // add_data.sort();
  const filters = [
    'livefyre',
    'moatad',
    'analytics',
    'controltag',
    'chartbeat',
    'googlesyndication',
    'doubleclick',
    'lovelydrum',
    'adnxs',
    'quantserve',
    'apester',
    'rubiconproject',
    'serverbid',
    'spotxchange',
    'openx',
    'springserve'

    // 'category/bundles'
  ];
  page.on('request', (req) => {
    const url = req.url();
    const shouldAbort_all_adds = false;
    //= filters.some((urlPart) => url.includes(urlPart));
    const shouldAbort = filters.some((urlPart) => url.includes(urlPart));
    const shouldAbort_resource = filtered_resources.some((resources) => req.resourceType().includes(resources));
    if (shouldAbort_all_adds || shouldAbort || shouldAbort_resource) {
      req.abort();
    } else {
      req.continue()
    }
  });
  // const ext = '/Users/ckanich/Downloads/uBlock0.chromium'; `--load-extension=${ext}`, `--disable-extensions-except=${ext}`
  // let page1 = [page1, page1];
  // for await (page of page1) {
  // }
  // page.on('response', async (response) => {
  //   const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
  //   if (matches && (matches.length === 2)) {
  //     const extension = matches[1];
  //     // const buffer = await response.buffer();
  //     fs.writeFileSync(`images/images.txt`, matches[0], 'utf8');
  //   }
  // });

  let arr = ['https://javascriptweekly.com/issues']
  while (arr.length) {
    let url = arr.pop();
    try {
      await page.goto(url, {
        waitUntil: "networkidle0",
      }).catch(e => {
        e
      });

      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.issue > a')).map(a => [a.innerText, window.location.hostname + a.getAttribute('href')])
      })


      // await element[0]
      // .screenshot({
      //   path: `public/${symbol}_max_pain_${item_catagory}.png`,
      // })


      console.log(links)


    } catch (err) {

      console.log(err)

    }
  }
}


Puppeteer();



