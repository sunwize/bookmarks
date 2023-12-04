'use client';

import { useParams } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Bookmark, BookmarkList } from '@/types/bookmark';
import Button from '@/components/Button';
import BookmarkItem from '@/components/BookmarkItem';
import Dialog from '@/components/Dialog';
import { extractMetaData } from '@/lib/services/jsonlink';
import { AiOutlineLoading } from 'react-icons/ai';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useSupabase } from '@/lib/composables/useSupabase';
import { MdOutlineBookmarkAdd } from 'react-icons/md';

interface Props {
    className?: string
}

export default function Bookmarks({ className }: Props) {
  const { id: listId } = useParams<{ id: string }>();
  const supabase = useSupabase();

  const [listTitle, setListTitle] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [url, setUrl] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);

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

  const saveBookmark = async () => {
    try {
      setIsSaving(true);
      const bookmark = await extractMetaData(url);

      const { data, error }: PostgrestSingleResponse<Bookmark> = await supabase
        .from('bookmarks')
        .insert({
          ...bookmark,
          list_id: listId,
        })
        .select()
        .limit(1)
        .single();

      if (error) {
        setIsErrorVisible(true);
        return;
      }

      setBookmarks((val) => [
        ...val,
        data,
      ]);

      setIsDialogVisible(false);
      setUrl('');
    } catch (err) {
      setIsErrorVisible(true);
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onHide = () => {
    setIsDialogVisible(false);
    setUrl('');
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
                onClick={() => setIsDialogVisible(true)}
                className="text-2xl"
              >
                <MdOutlineBookmarkAdd />
              </Button>
            </div>
            <ListView />
          </>
        )
      }

      <Dialog
        visible={isDialogVisible}
        onHide={onHide}
      >
        <p className="text-2xl text-center font-bold opacity-80 mb-6">Add a bookmark</p>
        <label>
          <p className="font-medium mb-1">URL</p>
          <input
            value={url}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUrl(event.target.value)}
            placeholder="https://..."
            autoFocus={true}
            className="
              block w-full bg-white/10 border-2 border-white/50 rounded-xl outline-0 px-3 py-2
              focus:border-white
            "
          />
        </label>
        {
          isErrorVisible && (
            <p className="text-red-400 mt-2">This link is not compatible.</p>
          )
        }
        <div className="flex justify-end mt-6">
          <Button
            onClick={saveBookmark}
            disabled={!url || isSaving}
            className="flex items-center gap-2"
          >
            {
              isSaving && (
                <AiOutlineLoading className="animate-spin" />
              )
            }
              Save
          </Button>
        </div>
      </Dialog>
    </>
  );
}
