'use client';

import { Bookmark } from '@/types/bookmark';
import BookmarkItem from '@/components/BookmarkItem';
import { useEffect, useState } from 'react';
import { extractMetadata } from '@/lib/utils/metadata';

const links = [
  'https://a.co/d/7sIw6O8',
  'https://www.instagram.com/p/C0cZlJxgvpI/?utm_source=ig_web_button_share_sheet&igshid=ZDNlZDc0MzIxNw==',
  'https://pin.it/4mTLvYb',
  'https://www.ikea.com/ca/fr/p/utespelare-bureau-de-jeux-noir-80507627/',
  'https://youtu.be/bFJUCAg6fOY?si=saZZiv6Nc58Va6dY',
  'https://typehero.dev/',
  'https://www.ricardocuisine.com/recettes/3765-crepes-de-base',
  'https://www.tiktok.com/@nicoleebennett/video/7220871479259303210',
];

export default function Debug() {
  const [bookmarks, setBookmarks] = useState<Omit<Bookmark, 'id'>[]>([]);

  const loadBookmarks = async () => {
    const metadata = await Promise.all(links.map((link) => extractMetadata(link)));
    setBookmarks(metadata);
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6">Debug</h1>
      <div className="grid grid-cols-1 gap-2">
        {
          bookmarks.map((bookmark, index) => (
            <BookmarkItem
              bookmark={bookmark}
              key={index}
            />
          ))
        }
      </div>
    </>
  );
}
