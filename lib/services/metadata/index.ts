import axios from 'axios';
import { JSDOM } from 'jsdom';
import { extractDescription, extractFavicon, extractImage, extractSitename, extractTitle } from '@/lib/services/metadata/utils';
import { MetadataExtractors } from '@/lib/services/metadata/extractors';
import { Bookmark } from '@/types/bookmark';

const getPrimaryDomainName = (domain: string) => {
  const tab = domain.split('.');
  return tab.slice(tab.length - 2, tab.length).join('.');
};

export const extractMetadata = async (url: string): Promise<Omit<Bookmark, 'id'>> => {
  const response = await axios.get<string>(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Origin: url,
    },
  });

  // Using the response url in case of redirects
  // For instance Amazon will redirect from https://a.co/... to https://www.amazon.ca/...
  const responseUrl = response.request.res.responseUrl as string;
  const urlObject = new URL(responseUrl);
  const domainName = getPrimaryDomainName(urlObject.hostname);

  if (domainName in MetadataExtractors) {
    const extractor = MetadataExtractors[domainName];
    return extractor(responseUrl);
  }

  const { window } = new JSDOM(response.data);
  const document = window.document;

  return {
    title: extractTitle(document)!,
    description: extractDescription(document)!,
    image_url: extractImage(document) || extractFavicon(document, responseUrl),
    sitename: extractSitename(document, responseUrl),
    domain: urlObject.hostname,
    url,
  };
};
