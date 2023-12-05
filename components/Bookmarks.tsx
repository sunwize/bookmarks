'use client';

import { useParams } from 'next/navigation';
import { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Bookmark, BookmarkList } from '@/types/bookmark';
import Button from '@/components/Button';
import BookmarkItem from '@/components/BookmarkItem';
import { AiOutlineLoading } from 'react-icons/ai';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useSupabase } from '@/lib/composables/useSupabase';
import { MdOutlineBookmarkAdd } from 'react-icons/md';
import Drawer from '@/components/Drawer';
import { extractMetaData } from '@/lib/services/jsonlink';
import { CollectionSelectorContext } from '@/lib/composables/useCollectionSelector';

interface Props {
    className?: string
}

export default function Bookmarks({ className }: Props) {
  const { id: listId } = useParams<{ id: string }>();
  const supabase = useSupabase();
  const { setIsBookmarkExtractorVisible } = useContext(CollectionSelectorContext);

  const [listTitle, setListTitle] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookmarks = async () => {
    try {
      setIsLoading(true);

      const { data: bookmarkList }: PostgrestSingleResponse<BookmarkList & { bookmarks: Bookmark[] }> = await supabase
        .from('bookmark_lists')
        .select(`
          *,
          bookmarks (*)
        `)
        .eq('id', listId)
        .single();

      if (!bookmarkList) {
        return;
      }

      setListTitle(bookmarkList.title);
      setBookmarks(bookmarkList.bookmarks);
    } finally {
      setIsLoading(false);
    }
  };

  const ListView = useCallback(() => (
    <>
      {
        bookmarks.length > 0 ? (
          <ul className={`grid grid-cols-1 gap-2 ${className}`}>
            {
              bookmarks.map((bookmark, index) => (
                <li key={index}>
                  <BookmarkItem bookmark={bookmark} />
                </li>
              ))
            }
          </ul>
        ) : (
          <p className="text-xl text-center opacity-50">No bookmarks here.</p>
        )
      }
    </>
  ), [bookmarks, className]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <>
      {
        isLoading ? (
          <div className="flex justify-center mt-12">
            <AiOutlineLoading
              size={60}
              className="animate-spin opacity-50"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-center text-3xl font-bold">{listTitle}</h1>
              <Button
                onClick={() => setIsBookmarkExtractorVisible(true)}
                className="text-2xl"
              >
                <MdOutlineBookmarkAdd />
              </Button>
            </div>
            <ListView />
          </>
        )
      }
    </>
  );
}
