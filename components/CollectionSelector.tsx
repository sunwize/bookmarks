'use client';

import Button from '@/components/Button';
import Drawer from '@/components/Drawer';
import { useContext, useEffect, useState } from 'react';
import { BookmarkList } from '@/types/bookmark';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useSupabase } from '@/lib/composables/useSupabase';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { DialogsContext } from '@/lib/contexts/DialogsContext';
import BookmarkItem from '@/components/BookmarkItem';
import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi';

interface Props {
  visible: boolean
  onHide?: () => void
}

export default function CollectionSelector({ visible, onHide }: Props) {
  const supabase = useSupabase();
  const router = useRouter();
  const {
    bookmark,
    setIsCollectionSelectorVisible,
    setIsCollectionCreatorVisible,
  } = useContext(DialogsContext);

  const [bookmarkLists, setBookmarkLists] = useState<BookmarkList[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const loadBookmarkLists = async () => {
    const { data }: PostgrestSingleResponse<BookmarkList[]> = await supabase
      .from('bookmark_lists')
      .select()
      .order('created_at', { ascending: false });

    if (!data) {
      return;
    }

    setBookmarkLists(data);
  };

  const saveBookmark = async (listId: string) => {
    try {
      if (!bookmark) {
        return;
      }

      setIsAdding(true);

      await supabase.from('bookmarks')
        .insert({
          list_id: listId,
          title: bookmark.title,
          description: bookmark.description,
          url: bookmark.url,
          image_url: bookmark.image_url,
          sitename: bookmark.sitename,
          domain: bookmark.domain,
        });
    } finally {
      setIsAdding(false);
      setIsCollectionSelectorVisible(false);
      router.push(`/list/${listId}`);
    }
  };

  const openCollectionCreator = () => {
    setIsCollectionCreatorVisible(true);
  };

  const onCollectionAdded = () => {
    return supabase.channel('public:data')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookmark_lists' },
        (payload) => {
          const collection = payload.new as BookmarkList;
          setBookmarkLists((val) => [collection, ...val]);
        });
  };

  const listener = onCollectionAdded();

  useEffect(() => {
    if (visible) {
      loadBookmarkLists();
      listener.subscribe();
    } else {
      listener.unsubscribe();
    }
  }, [visible]);

  return (
    <Drawer
      visible={visible}
      onHide={onHide}
    >
      {
        bookmark && (
          <div className="mb-6">
            <BookmarkItem bookmark={bookmark} />
          </div>
        )
      }
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Button
          onClick={openCollectionCreator}
          disabled={isAdding}
          className="flex items-center gap-1"
        >
          <FiPlus />
          <span>New collection</span>
        </Button>
      </div>
      <div className="border-b-2 border-white/20 -mx-6" />
      <ul className="grid grid-cols-1 gap-2">
        {
          bookmarkLists.map((list) => (
            <li
              key={list.id}
              className="border-b-2 border-white/20 px-6 py-3 -mx-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-xl md:text-2xl font-bold truncate">{list.title}</p>
                <button
                  onClick={() => saveBookmark(list.id)}
                  disabled={isAdding}
                  className="text-white/60 active:text-white md:hover:text-white"
                >
                  <AiOutlinePlusCircle size={40} />
                </button>
              </div>
            </li>
          ))
        }
      </ul>
    </Drawer>
  );
}
