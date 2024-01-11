'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { FiMinusCircle } from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-toastify';

import { useSupabase } from '@/lib/composables/useSupabase';
import { useCollection } from '@/lib/composables/useCollection';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import VisibilityObserver from '@/components/VisibilityObserver';
import { useAuth } from '@/lib/contexts/AuthContext';

type Props = {
    visible: boolean
    collectionId: string
    onHide?: () => void
}

export default function CollectionEditor({ visible, collectionId, onHide }: Props) {
  const supabase = useSupabase();
  const { user } = useAuth();

  const [bookmarkIdsToRemove, setBookmarkIdsToRemove] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const {
    collection,
    setCollection,
    bookmarks,
    setBookmarks,
    isLoading,
    loadBookmarks,
  } = useCollection(collectionId, visible);

  const bookmarksFiltered = useMemo(
    () => bookmarks.filter((bookmark) => !bookmarkIdsToRemove.includes(bookmark.id)),
    [bookmarks, bookmarkIdsToRemove]
  );

  const collectionTitle = useMemo(() => collection?.title, [collection]);
  const setCollectionTitle = (title: string) => {
    if (collection) {
      setCollection({
        ...collection,
        title,
      });
    }
  };

  const updateCollectionName = async () => {
    if (!collectionTitle) {
      return;
    }

    const { error } = await supabase.from('bookmark_lists')
      .update({
        title: collectionTitle,
      })
      .eq('id', collectionId);

    if (error) {
      console.error(error);
    }
  };

  const removeBookmarks = async () => {
    if (bookmarkIdsToRemove.length <= 0) {
      return;
    }

    const { count, error } = await supabase.from('bookmarks')
      .delete({ count: 'estimated' })
      .in('id', bookmarkIdsToRemove);

    if (error) {
      console.error(error);
      return;
    }

    if (!count) {
      toast('Something wrong happened', { type: 'error' });
      return;
    }

    setBookmarks(bookmarksFiltered);
    setBookmarkIdsToRemove([]);
  };

  const removeBookmark = (bookmarkId: string) => {
    setBookmarkIdsToRemove((val) => [...val, bookmarkId]);
  };

  const onBottomPageReached = async () => {
    await loadBookmarks();
  };

  const saveChanges = async () => {
    setIsSaving(true);
    await removeBookmarks();
    await updateCollectionName();
    setIsSaving(false);
    onHide?.();

    toast('Collection updated', { type: 'success' });
  };

  return (
    <Drawer
      visible={visible}
      onHide={onHide}
    >
      <div>
        {
          isLoading ? (
            <div className="flex justify-center my-6">
              <AiOutlineLoading
                size={60}
                className="animate-spin opacity-50"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between p-3">
                <input
                  value={collectionTitle}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setCollectionTitle(event.target.value)}
                  placeholder="Collection name"
                  className="block w-full bg-white/10 border-2 border-white/50 rounded-xl outline-0 md:text-2xl px-3 py-2 focus:border-white"
                />
              </div>
              <hr className="border-white/40" />
              {
                bookmarksFiltered.length > 0 ? (
                  <>
                    <ul>
                      {
                        bookmarksFiltered.map((bookmark) => (
                          <li
                            key={bookmark.id}
                            className="flex items-center justify-between gap-3 border-b border-white/20 last-of-type:border-b-0 p-3"
                          >
                            <div className="flex items-center gap-2 md:gap-3 flex-1 truncate">
                              <Image
                                src={bookmark.image_url}
                                alt={bookmark.title}
                                width={256}
                                height={256}
                                className="w-[50px] md:w-[70px] aspect-square object-cover rounded-lg shrink-0"
                              />
                              <div className="truncate">
                                <p className="text-lg md:text-xl font-medium truncate">{bookmark.title}</p>
                                <p className="opacity-50 truncate">{bookmark.description}</p>
                              </div>
                            </div>
                            {
                              (user?.id === bookmark.user_id || !bookmark.user_id) && (
                                <button
                                  onClick={() => removeBookmark(bookmark.id)}
                                  className="opacity-50 active:opacity-100 md:hover:opacity-100 text-3xl shrink-0 disabled:pointer-events-none"
                                >
                                  <FiMinusCircle/>
                                </button>
                              )
                            }
                          </li>
                        ))
                      }
                    </ul>
                    <VisibilityObserver onVisible={onBottomPageReached}/>
                  </>
                ) : (
                  <p className="text-center opacity-80 py-6">No bookmarks here.</p>
                )
              }
              <footer className="sticky bottom-0 bg-slate-950 border-t border-white/40 p-3">
                <Button
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="w-full text-xl flex items-center justify-center"
                >
                  {
                    isSaving ? (
                      <AiOutlineLoading
                        size={28}
                        className="animate-spin"
                      />
                    ) : (
                      <span>Save</span>
                    )
                  }
                </Button>
              </footer>
            </div>
          )
        }
      </div>
    </Drawer>
  );
}
