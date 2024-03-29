'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { BookmarkCollection } from '@/types/bookmark';
import { AiOutlineLoading } from 'react-icons/ai';
import { useSupabase } from '@/lib/composables/useSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { MdOutlineBookmarkAdd } from 'react-icons/md';
import Button from '@/components/ui/Button';
import { DialogsContext } from '@/lib/contexts/DialogsContext';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

type Props = {
  className?: string
}

export default function Collections({ className }: Props) {
  const supabase = useSupabase();
  const { setIsCreationDialogVisible, setCreationTab } = useContext(DialogsContext);

  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const { data, error }: PostgrestSingleResponse<BookmarkCollection[]> = await supabase
        .from('bookmark_lists')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setCollections(data);
    } finally {
      setIsLoading(false);
    }
  };

  const onCollectionAdded = () => {
    return supabase.channel('public:collections')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookmark_lists' },
        (payload) => {
          const collection = payload.new as BookmarkCollection;
          setCollections((val) => [collection, ...val]);
        })
      .subscribe();
  };

  const ListView = useCallback(() => (
    collections.length > 0 ? (
      <ul className={`grid grid-cols-1 gap-2 ${className}`}>
        {
          collections.map((collection, index) => (
            <li key={index}>
              <Link
                href={`/collection/${collection.id}`}
                className="
                  flex justify-between w-full text-left border-2 border-dashed border-white/20 rounded-xl px-4 py-5 transition
                  active:bg-white/10 md:hover:bg-white/10
                "
              >
                <span className="text-2xl font-medium tracking-wide truncate">{collection.title}</span>
                <FiChevronRight
                  size={30}
                  className="opacity-80 shrink-0"
                />
              </Link>
            </li>
          ))
        }
      </ul>
    ) : (
      <p className="text-xl text-center opacity-50">No collection found.</p>
    )
  ), [collections, className]);

  const openCreationDialog = () => {
    setCreationTab('collection');
    setIsCreationDialogVisible(true);
  };

  useEffect(() => {
    loadCollections();

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
          onClick={openCreationDialog}
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
