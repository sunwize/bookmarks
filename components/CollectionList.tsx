'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { BookmarkList } from '@/types/bookmark';
import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import { AiOutlineLoading } from 'react-icons/ai';
import { useSupabase } from '@/lib/composables/useSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { BiPlus } from 'react-icons/bi';

interface Props {
  className?: string
}

export default function CollectionList({ className }: Props) {
  const [bookmarkLists, setBookmarkLists] = useState<BookmarkList[]>([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [listName, setListName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const supabase = useSupabase();

  const loadBookmarkLists = async () => {
    try {
      setIsLoading(true);
      const { data, error }: PostgrestSingleResponse<BookmarkList[]> = await supabase
        .from('bookmark_list')
        .select();

      if (error) {
        console.error(error);
        return;
      }

      setBookmarkLists(data);
    } finally {
      setIsLoading(false);
    }
  };

  const saveList = async () => {
    try {
      setIsCreating(true);

      const { data, error }: PostgrestSingleResponse<{ id: string, title: string }[]> = await supabase
        .from('bookmark_list')
        .insert({
          title: listName,
        })
        .select();

      if (error) {
        console.error(error);
        return;
      }

      const list = data ? data[0] : null;

      if (!list) {
        return;
      }

      setBookmarkLists((val) => [
        ...val,
        {
          id: list.id,
          title: list.title,
          bookmarks: [],
        },
      ]);
      setIsDialogVisible(false);
    } finally {
      setIsCreating(false);
    }
  };

  const ListView = useCallback(() => (
    bookmarkLists.length > 0 ? (
      <ul className={`grid grid-cols-1 gap-2 ${className}`}>
        {
          bookmarkLists.map((bookmarkList, index) => (
            <li key={index}>
              <a
                href={`/list/${bookmarkList.id}`}
                className="
                block w-full text-left border-2 border-dashed border-white/20 rounded-xl px-4 py-5 transition
                active:bg-white/10 md:hover:bg-white/10
              "
              >
                <span className="text-2xl font-medium tracking-wide">{bookmarkList.title}</span>
              </a>
            </li>
          ))
        }
      </ul>
    ) : (
      <p className="text-xl text-center opacity-50">No list found.</p>
    )
  ), [bookmarkLists, className]);

  useEffect(() => {
    loadBookmarkLists();
  }, []);

  return (
    <>
      <div className="flex justify-center mb-6">
        <Button
          onClick={() => setIsDialogVisible(true)}
          className="text-2xl !font-bold !py-3 !px-6 flex items-center gap-1"
        >
          <BiPlus />
          New list
        </Button>
      </div>
      {
        isLoading ? (
          <div className="flex justify-center mt-12">
            <AiOutlineLoading
              size={60}
              className="animate-spin opacity-50"
            />
          </div>
        ) : (
          <ListView />
        )
      }

      <Dialog visible={isDialogVisible} onHide={() => setIsDialogVisible(false)}>
        <p className="text-2xl text-center font-bold opacity-80 mb-6">Create a new list</p>
        <label>
          <p className="font-medium mb-1">List name</p>
          <input
            value={listName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setListName(event.target.value)}
            placeholder="List name"
            autoFocus={true}
            className="
              block w-full bg-white/10 border-2 border-white/50 rounded-xl outline-0 px-3 py-2
              focus:border-white
            "
          />
          <div className="flex justify-end mt-6">
            <Button onClick={saveList} disabled={!listName || isCreating} className="flex items-center gap-2">
              {
                isCreating && (
                  <AiOutlineLoading className="animate-spin" />
                )
              }
              Save
            </Button>
          </div>
        </label>
      </Dialog>
    </>
  );
}
