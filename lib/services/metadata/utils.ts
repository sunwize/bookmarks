export const extractTitle = (document: Document) => {
  return document.head.querySelector('meta[property="og:title"]')?.getAttribute('content')
    || document.querySelector('meta[name="title"]')?.getAttribute('content');
};

export const extractDescription = (document: Document) => {
  return document.head.querySelector('meta[property="og:description"]')?.getAttribute('content')
    || document.querySelector('meta[name="description"]')?.getAttribute('content');
};

export const extractImage = (document: Document) => {
  return document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')
    || document.querySelector('#landingImage')?.getAttribute('src'); // Amazon
};

export const extractFavicon = (document: Document, url: string) => {
  const urlObject = new URL(url);
  return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=256`;
};

export const extractSitename = (document: Document, url: string) => {
  const urlObject = new URL(url);
  const tab = urlObject.hostname.split('.');
  const str = tab[tab.length - 2];
  const sitename = str.charAt(0).toUpperCase() + str.slice(1);

  return document.head.querySelector('meta[property="og:site_name"]')?.getAttribute('content')
    || sitename;
};
