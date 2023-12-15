import { Bookmark } from '@/types/bookmark';
import { extractTikTokMetadata } from '@/lib/services/metadata/extractors/tiktok';
import { extractSpotifyMetadata } from '@/lib/services/metadata/extractors/spotify';

export const MetadataExtractors: Record<string, (url: string) => Promise<Omit<Bookmark, 'id'>>> = {
  'tiktok.com': extractTikTokMetadata,
  'spotify.com': extractSpotifyMetadata,
};
