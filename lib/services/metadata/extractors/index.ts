import { Bookmark } from '@/types/bookmark';
import { extractTikTokMetadata } from '@/lib/services/metadata/extractors/tiktok';

export const MetadataExtractors: Record<string, (url: string) => Promise<Omit<Bookmark, 'id'>>> = {
  'www.tiktok.com': extractTikTokMetadata,
};
