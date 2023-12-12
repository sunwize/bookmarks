import { loadMetadata } from '@/lib/services/jsonlink';
import { api } from '@/lib/services/api';
import { Bookmark } from '@/types/bookmark';

export const extractMetadata = async (url: string) => {
  let metadata = await loadMetadata(url);

  if (!metadata.title || !metadata.description) {
    const { data } = await api.get<Omit<Bookmark, 'id'>>('/api/metadata', {
      params: { url },
    });

    metadata = data;
  }

  return metadata;
};
