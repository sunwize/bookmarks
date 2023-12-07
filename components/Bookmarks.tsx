'use client';

import { useParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Bookmark, BookmarkList } from '@/types/bookmark';
import Button from '@/components/Button';
import BookmarkItem from '@/components/BookmarkItem';
import { AiOutlineLoading } from 'react-icons/ai';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useSupabase } from '@/lib/composables/useSupabase';
import { MdOutlineBookmarkAdd } from 'react-icons/md';
import { DialogsContext } from '@/lib/contexts/DialogsContext';

interface Props {
    className?: string
}

export default function Bookmarks({ className }: Props) {
  const { id: listId } = useParams<{ id: string }>();
  const supabase = useSupabase();
  const { setIsCreationDialogVisible, setCreationTab } = useContext(DialogsContext);

  const [listTitle, setListTitle] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadBookmarks = async () => {
    try {
      setIsLoading(true);

      const { data: bookmarkList }: PostgrestSingleResponse<BookmarkList> = await supabase
        .from('bookmark_lists')
        .select()
        .eq('id', listId)
        .single();

      const { data: bookmarks }: PostgrestSingleResponse<Bookmark[]> = await supabase
        .from('bookmarks')
        .select()
        .order('created_at', { ascending: false })
        .eq('list_id', listId);

      if (!bookmarkList || !bookmarks) {
        setIsError(true);
        return;
      }

      setListTitle(bookmarkList.title);
      setBookmarks(bookmarks);
    } finally {
      setIsLoading(false);
    }
  };

  const onBookmarkAdded = () => {
    return supabase.channel('public:bookmarks')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookmarks', filter: `list_id=eq.${listId}` },
        (payload) => {
          const bookmark = payload.new as Bookmark & { list_id: string };

          if (listId === bookmark.list_id) {
            setBookmarks((val) => [bookmark, ...val]);
          }
        })
      .subscribe();
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

  const openCreationDialog = () => {
    setCreationTab('bookmark');
    setIsCreationDialogVisible(true);
  };

  useEffect(() => {
    loadBookmarks();

    const listener = onBookmarkAdded();

    return () => {
      listener.unsubscribe();
    };
  }, []);

  if (isError) {
    return (
      <p className="text-xl text-center opacity-50">Bookmark list not found.</p>
    );
  }

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
                onClick={openCreationDialog}
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
