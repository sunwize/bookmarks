import axios from 'axios';
import { Bookmark } from '@/types/bookmark';

interface ApiResponse {
  title: string
  description: string
  url: string
  images: string[]
  sitename: string
  favicon: string
  domain: string
}

const api = axios.create({
  baseURL: 'https://jsonlink.io',
  params: {
    api_key: process.env.NEXT_PUBLIC_JSON_LINK_API_KEY,
  },
});

export const extractMetaData = async (url: string): Promise<Omit<Bookmark, 'id'>> => {
  const { data } = await api.get<ApiResponse>('/api/extract', {
    params: {
      url,
    },
  });

  return {
    title: data.title,
    description: data.description,
    url: data.url,
    image_url: data.images[0],
    sitename: data.sitename,
    domain: data.domain,
  };
};
