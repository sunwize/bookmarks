import { useCallback, useEffect, useRef, useState } from 'react';
import { Bookmark, BookmarkCollection } from '@/types/bookmark';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useSupabase } from '@/lib/composables/useSupabase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const LIMIT = 20;

export const useCollection = (collectionId: string, autoload = true) => {
  const supabase = useSupabase();
  const router = useRouter();

  const [collection, setCollection] = useState<BookmarkCollection>();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const pageOffset = useRef(0);

  const loadCollection = useCallback(async () => {
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
  }, [collectionId, supabase]);

  const loadBookmarks = useCallback(async (reset = false) => {
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
      setBookmarks(() => bookmarks);
      pageOffset.current += LIMIT;
    } else if (bookmarks.length > 0) {
      setBookmarks((val) => [...val, ...bookmarks]);
      pageOffset.current += LIMIT;
    } else {
      pageOffset.current = -1;
    }

    if (bookmarks.length < LIMIT) {
      pageOffset.current = -1;
    }
  }, [collectionId, supabase]);

  const loadCollectionAndBookmarks = useCallback(async (reset = false) => {
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
  }, [loadBookmarks, loadCollection]);

  const removeCollection = useCallback(async () => {
    if (!collection) {
      return;
    }

    const confirm = window.confirm(`Are you sure you want to delete "${collection.title}"?`);

    if (confirm) {
      const { count, error } = await supabase.from('bookmark_lists')
        .delete({ count: 'estimated' })
        .eq('id', collectionId);

      if (error) {
        console.error(error);
        return;
      }

      if (!count) {
        toast('Something wrong happened', { type: 'error' });
        return;
      }

      router.replace('/');
      toast('Collection deleted', { type: 'success' });
    }
  }, [collection, collectionId, router, supabase]);

  useEffect(() => {
    if (autoload) {
      loadCollectionAndBookmarks(true)
        .catch((err) => console.error(err));
    }
  }, [autoload, loadCollectionAndBookmarks]);

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
    removeCollection,
  };
};
