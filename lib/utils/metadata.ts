import { loadMetadata } from '@/lib/services/jsonlink';
import { api } from '@/lib/services/api';
import { Bookmark } from '@/types/bookmark';
import { MetadataExtractors } from '@/lib/services/metadata/extractors';

export const getPrimaryDomainName = (url: string) => {
  const urlObject = new URL(url);
  const tab = urlObject.hostname.split('.');
  return tab.slice(tab.length - 2, tab.length).join('.');
};

export const extractMetadata = async (url: string) => {
  const domainName = getPrimaryDomainName(url);
  let metadata: Omit<Bookmark, 'id'> | null = null;

  if (!Object.keys(MetadataExtractors).includes(domainName)) {
    metadata = await loadMetadata(url);
  }

  if (!metadata || !metadata.title || !metadata.description) {
    const { data } = await api.get<Omit<Bookmark, 'id'>>('/api/metadata', {
      params: { url },
    });

    metadata = data;
  }

  return metadata;
};
