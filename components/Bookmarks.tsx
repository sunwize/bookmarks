'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AiOutlineLoading } from 'react-icons/ai';
import { FiMoreVertical, FiPlus } from 'react-icons/fi';
import { MdOutlineBookmarkAdd } from 'react-icons/md';

import { Bookmark } from '@/types/bookmark';
import { useSupabase } from '@/lib/composables/useSupabase';
import { extractMetadata } from '@/lib/utils/metadata';
import { DialogsContext } from '@/lib/contexts/DialogsContext';
import { useCollection } from '@/lib/composables/useCollection';
import Button from '@/components/ui/Button';
import BookmarkItem from '@/components/BookmarkItem';
import CollectionEditor from '@/components/drawers/CollectionEditor';
import VisibilityObserver from '@/components/VisibilityObserver';
import CollectionActions, { CollectionActionType } from '@/components/drawers/CollectionActions';

export default function Bookmarks() {
  const { id: collectionId } = useParams<{ id: string }>();
  const supabase = useSupabase();
  const { setIsCreationDialogVisible, setCreationTab } = useContext(DialogsContext);

  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const {
    collection,
    bookmarks,
    setBookmarks,
    isLoading,
    isError,
    loadBookmarks,
    loadCollectionAndBookmarks,
    removeCollection,
  } = useCollection(collectionId);

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

  const onLoadImageError = useCallback(async (index: number) => {
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
  }, [bookmarks, setBookmarks, supabase]);

  const onCloseEditor = (changed: boolean) => {
    if (isEditorVisible && changed) {
      loadCollectionAndBookmarks(true);
    }
    setIsEditorVisible(() => false);
  };

  const openCreationDialog = () => {
    setCreationTab('bookmark');
    setIsCreationDialogVisible(true);
  };

  const onBottomPageReached = async () => {
    await loadBookmarks();
  };

  const onCollectionAction = async (type: CollectionActionType) => {
    switch (type) {
      case 'edit':
        setIsActionsVisible(false);
        setIsEditorVisible(true);
        break;
      case 'delete':
        await removeCollection();
        break;
      default:
        break;
    }
  };

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
            <div className="flex items-center justify-between gap-2 mb-3 md:mb-6">
              <h1 className="text-center text-3xl font-bold truncate">{collection?.title}</h1>
              <Button
                onClick={() => setIsActionsVisible(true)}
                className="text-2xl shrink-0 !bg-transparent text-white/50 active:text-white md:hover:text-white"
              >
                <FiMoreVertical />
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
            {
              bookmarks.length > 0 ? (
                <ul className="grid grid-cols-1 gap-2">
                  {
                    bookmarks.map((bookmark, index) => (
                      <li key={bookmark.id}>
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
            <VisibilityObserver onVisible={onBottomPageReached} />

            <Button
              onClick={openCreationDialog}
              className="md:hidden fixed bottom-20 right-3 !rounded-full shadow-3xl !p-4"
            >
              <MdOutlineBookmarkAdd size={40} />
            </Button>
          </>
        )
      }
      {
        collection && (
          <CollectionActions
            visible={isActionsVisible}
            onHide={() => setIsActionsVisible(false)}
            onAction={onCollectionAction}
            collection={collection}
          />
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
