'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AiOutlineLoading } from 'react-icons/ai';
import { FiEdit3, FiPlus } from 'react-icons/fi';
import { MdOutlineBookmarkAdd } from 'react-icons/md';

import { Bookmark } from '@/types/bookmark';
import { useSupabase } from '@/lib/composables/useSupabase';
import { extractMetadata } from '@/lib/utils/metadata';
import { DialogsContext } from '@/lib/contexts/DialogsContext';
import { useBookmarks } from '@/lib/composables/useBookmarks';
import Button from '@/components/Button';
import BookmarkItem from '@/components/BookmarkItem';
import CollectionEditor from '@/components/CollectionEditor';

interface Props {
    className?: string
}

export default function Bookmarks({ className }: Props) {
  const { id: collectionId } = useParams<{ id: string }>();
  const supabase = useSupabase();
  const { setIsCreationDialogVisible, setCreationTab } = useContext(DialogsContext);

  const [isEditorVisible, setIsEditorVisible] = useState(false);

  const {
    collection,
    bookmarks,
    setBookmarks,
    isLoading,
    isError,
    loadBookmarks,
  } = useBookmarks(collectionId);

  const onBookmarkAction = () => {
    return supabase.channel('public:bookmarks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks', filter: `list_id=eq.${collectionId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const bookmark = payload.new as Bookmark & { list_id: string };

            if (collectionId === bookmark.list_id) {
              setBookmarks((val) => [bookmark, ...val]);
            }
          } else if (payload.eventType === 'DELETE') {
            const bookmarkId = payload.old.id as string;
            setBookmarks((val) => val.filter((b) => b.id !== bookmarkId));
          }
        })
      .subscribe();
  };

  const onLoadImageError = async (index: number) => {
    const bookmark = bookmarks[index];
    const { image_url: imageUrl } = await extractMetadata(bookmark.url);

    await supabase.from('bookmarks')
      .update({
        image_url: imageUrl,
      })
      .eq('id', bookmark.id);

    setBookmarks((val) => [
      ...val.slice(0, index),
      {
        ...bookmark,
        image_url: imageUrl,
      },
      ...val.slice(index + 1, val.length),
    ]);
  };

  const onCloseEditor = () => {
    if (isEditorVisible) {
      loadBookmarks();
    }
    setIsEditorVisible(() => false);
  };

  const openCreationDialog = () => {
    setCreationTab('bookmark');
    setIsCreationDialogVisible(true);
  };

  const ListView = useCallback(() => (
    <>
      {
        bookmarks.length > 0 ? (
          <ul className={`grid grid-cols-1 gap-2 ${className}`}>
            {
              bookmarks.map((bookmark, index) => (
                <li key={index}>
                  <BookmarkItem
                    bookmark={bookmark}
                    onLoadImageError={() => onLoadImageError(index)}
                  />
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
    const listener = onBookmarkAction();

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
            <div className="flex items-center justify-between gap-2 mb-6">
              <h1 className="text-center text-3xl font-bold truncate">{collection?.title}</h1>
              <Button
                onClick={() => setIsEditorVisible(true)}
                className="text-2xl shrink-0 !bg-transparent text-white/50 active:text-white md:hover:text-white"
              >
                <FiEdit3 />
              </Button>
            </div>
            <div className="hidden md:block mb-3">
              <Button
                onClick={openCreationDialog}
                className="flex items-center gap-1"
              >
                <FiPlus />
                <span>Add a bookmark</span>
              </Button>
            </div>
            <ListView />

            <Button
              onClick={openCreationDialog}
              className="md:hidden fixed bottom-28 right-3 !rounded-full shadow-3xl !p-4"
            >
              <MdOutlineBookmarkAdd size={40} />
            </Button>
          </>
        )
      }
      <CollectionEditor
        visible={isEditorVisible}
        collectionId={collectionId}
        onHide={onCloseEditor}
      />
    </>
  );
}
