'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { BookmarkList } from '@/types/bookmark';
import { AiOutlineLoading } from 'react-icons/ai';
import { useSupabase } from '@/lib/composables/useSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { MdOutlineBookmarkAdd } from 'react-icons/md';
import Button from '@/components/Button';
import { DialogsContext } from '@/lib/contexts/DialogsContext';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

interface Props {
  className?: string
}

export default function CollectionList({ className }: Props) {
  const supabase = useSupabase();
  const { setIsBookmarkExtractorVisible } = useContext(DialogsContext);

  const [bookmarkLists, setBookmarkLists] = useState<BookmarkList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookmarkLists = async () => {
    try {
      setIsLoading(true);
      const { data, error }: PostgrestSingleResponse<BookmarkList[]> = await supabase
        .from('bookmark_lists')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setBookmarkLists(data);
    } finally {
      setIsLoading(false);
    }
  };

  const onCollectionAdded = () => {
    return supabase.channel('public:data')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookmark_lists' },
        (payload) => {
          const collection = payload.new as BookmarkList;
          setBookmarkLists((val) => [collection, ...val]);
        })
      .subscribe();
  };

  const ListView = useCallback(() => (
    bookmarkLists.length > 0 ? (
      <ul className={`grid grid-cols-1 gap-2 ${className}`}>
        {
          bookmarkLists.map((bookmarkList, index) => (
            <li key={index}>
              <Link
                href={`/list/${bookmarkList.id}`}
                className="
                  flex justify-between w-full text-left border-2 border-dashed border-white/20 rounded-xl px-4 py-5 transition
                  active:bg-white/10 md:hover:bg-white/10
                "
              >
                <span className="text-2xl font-medium tracking-wide">{bookmarkList.title}</span>
                <FiChevronRight
                  size={30}
                  className="opacity-80"
                />
              </Link>
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

    const listener = onCollectionAdded();

    return () => {
      listener.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Collections</h2>
        <Button
          onClick={() => setIsBookmarkExtractorVisible(true)}
          className="text-2xl"
        >
          <MdOutlineBookmarkAdd />
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
    </>
  );
}
