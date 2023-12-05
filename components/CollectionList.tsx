'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { BookmarkList } from '@/types/bookmark';
import { AiOutlineLoading } from 'react-icons/ai';
import { useSupabase } from '@/lib/composables/useSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { MdOutlineBookmarkAdd } from 'react-icons/md';
import Button from '@/components/Button';
import { CollectionSelectorContext } from '@/lib/composables/useCollectionSelector';
import Link from 'next/link';

interface Props {
  className?: string
}

export default function CollectionList({ className }: Props) {
  const supabase = useSupabase();
  const { setIsBookmarkExtractorVisible } = useContext(CollectionSelectorContext);

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

  const ListView = useCallback(() => (
    bookmarkLists.length > 0 ? (
      <ul className={`grid grid-cols-1 gap-2 ${className}`}>
        {
          bookmarkLists.map((bookmarkList, index) => (
            <li key={index}>
              <Link
                href={`/list/${bookmarkList.id}`}
                className="
                  block w-full text-left border-2 border-dashed border-white/20 rounded-xl px-4 py-5 transition
                  active:bg-white/10 md:hover:bg-white/10
                "
              >
                <span className="text-2xl font-medium tracking-wide">{bookmarkList.title}</span>
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
