import { useEffect, useRef, useState } from 'react';
import { Bookmark, BookmarkCollection } from '@/types/bookmark';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useSupabase } from '@/lib/composables/useSupabase';

const LIMIT = 10;

export const useCollection = (collectionId: string, autoload = true) => {
  const supabase = useSupabase();

  const [collection, setCollection] = useState<BookmarkCollection>();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const pageOffset = useRef(0);

  const loadCollection = async () => {
    const { data: collection, error }: PostgrestSingleResponse<BookmarkCollection> = await supabase
      .from('bookmark_lists')
      .select()
      .eq('id', collectionId)
      .single();

    if (error) {
      setIsError(true);
      throw new Error(error.message);
    }

    setCollection(() => collection);
  };

  const loadBookmarks = async (reset = false) => {
    if (reset) {
      pageOffset.current = 0;
    }

    if (pageOffset.current === -1) {
      return;
    }

    const { data: bookmarks, error }: PostgrestSingleResponse<Bookmark[]> = await supabase
      .from('bookmarks')
      .select()
      .order('created_at', { ascending: false })
      .eq('list_id', collectionId)
      .range(pageOffset.current, pageOffset.current + LIMIT)
      .limit(LIMIT);

    if (error) {
      setIsError(true);
      throw new Error(error.message);
    }

    if (reset) {
      setBookmarks(bookmarks);
      pageOffset.current += LIMIT;
    } else if (bookmarks.length > 0) {
      setBookmarks((val) => [...val, ...bookmarks]);
      pageOffset.current += LIMIT;
    } else {
      pageOffset.current = -1;
    }
  };

  const loadCollectionAndBookmarks = async (reset = false) => {
    try {
      setIsLoading(true);

      await Promise.all([
        loadCollection(),
        loadBookmarks(reset),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoload) {
      loadCollectionAndBookmarks(true);
    }
  }, [autoload]);

  return {
    collection,
    setCollection,
    bookmarks,
    setBookmarks,
    isLoading,
    isError,
    loadCollection,
    loadBookmarks,
    loadCollectionAndBookmarks,
  };
};
