import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export const GET = async (request: NextRequest) => {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response('Missing URL parameter', {
      status: 400,
    });
  }

  const browser = await puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar'),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForSelector('head');
  const metadata = await page.evaluate(() => {
    const extractTitle = () => {
      return document.head.querySelector('meta[property="og:title"]')?.getAttribute('content')
        || document.querySelector('meta[name="title"]')?.getAttribute('content');
    };
    const extractDescription = () => {
      return document.head.querySelector('meta[property="og:description"]')?.getAttribute('content')
        || document.querySelector('meta[name="description"]')?.getAttribute('content');
    };
    const extractImage = () => {
      return document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')
        || document.querySelector('#landingImage')?.getAttribute('src') // Amazon
        || document.querySelector('picture img')?.getAttribute('src'); // TikTok
    };
    const extractFavicon = () => {
      return `https://www.google.com/s2/favicons?domain=${window.location.hostname}&sz=256`;
    };
    const extractSitename = () => {
      const tab = window.location.hostname.split('.');
      const str = tab[tab.length - 2];
      const sitename = str.charAt(0).toUpperCase() + str.slice(1);

      return document.head.querySelector('meta[property="og:site_name"]')?.getAttribute('content')
        || sitename;
    };

    return {
      title: extractTitle(),
      description: extractDescription(),
      image_url: extractImage() || extractFavicon(),
      favicon: extractFavicon(),
      sitename: extractSitename(),
      domain: window.location.hostname,
    };
  });

  await browser.close();

  return NextResponse.json({
    ...metadata,
    url,
  });
};
