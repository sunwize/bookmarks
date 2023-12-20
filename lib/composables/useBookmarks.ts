import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCollection } from '@/types/bookmark';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useSupabase } from '@/lib/composables/useSupabase';

export const useBookmarks = (collectionId: string, options = { fetchCondition: true }) => {
  const supabase = useSupabase();

  const [collection, setCollection] = useState<BookmarkCollection>();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadBookmarks = async () => {
    try {
      setIsLoading(true);

      const { data: collection }: PostgrestSingleResponse<BookmarkCollection> = await supabase
        .from('bookmark_lists')
        .select()
        .eq('id', collectionId)
        .single();

      const { data: bookmarks }: PostgrestSingleResponse<Bookmark[]> = await supabase
        .from('bookmarks')
        .select()
        .order('created_at', { ascending: false })
        .eq('list_id', collectionId);

      if (!collection || !bookmarks) {
        setIsError(true);
        return;
      }

      setCollection(collection);
      setBookmarks(bookmarks);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.fetchCondition) {
      loadBookmarks();
    }
  }, [options.fetchCondition]);

  return {
    collection,
    setCollection,
    bookmarks,
    setBookmarks,
    isLoading,
    isError,
    loadBookmarks,
  };
};
