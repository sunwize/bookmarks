'use client';

import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useSupabase } from '@/lib/composables/useSupabase';
import { Bookmark } from '@/types/bookmark';
import { AiOutlineLoading } from 'react-icons/ai';
import Button from '@/components/ui/Button';
import { FiMinusCircle, FiSave } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useCollection } from '@/lib/composables/useCollection';
import Drawer from '@/components/ui/Drawer';
import Image from 'next/image';
import VisibilityObserver from '@/components/VisibilityObserver';

type Props = {
    visible: boolean
    collectionId: string
    onHide?: () => void
}

export default function CollectionEditor({ visible, collectionId, onHide }: Props) {
  const supabase = useSupabase();
  const router = useRouter();

  const [isUpdatingCollectionTitle, setIsUpdatingCollectionTitle] = useState(false);
  const [bookmarkToRemove, setBookmarkToRemove] = useState<Bookmark|null>(null);
  const [isRemovingCollection, setIsRemovingCollection] = useState(false);

  const {
    collection,
    setCollection,
    bookmarks,
    setBookmarks,
    isLoading,
    loadBookmarks,
  } = useCollection(collectionId, visible);

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

    try {
      setIsUpdatingCollectionTitle(true);
      await supabase.from('bookmark_lists')
        .update({
          title: collectionTitle,
        })
        .eq('id', collectionId);
      toast('Collection updated', { type: 'success' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingCollectionTitle(false);
    }
  };

  const removeBookmark = async (bookmark: Bookmark) => {
    try {
      setBookmarkToRemove(() => bookmark);
      await supabase.from('bookmarks')
        .delete()
        .eq('id', bookmark.id);
      setBookmarks((val) => val.filter((b) => b.id !== bookmark.id));
      toast('Bookmark deleted', { type: 'success' });
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarkToRemove(() => null);
    }
  };

  const removeCollection = async () => {
    const confirm = window.confirm(`Are you sure you want to delete "${collectionTitle}"?`);

    if (confirm) {
      try {
        setIsRemovingCollection(() => true);
        const { error } = await supabase.from('bookmark_lists')
          .delete()
          .eq('id', collectionId);

        if (error) {
          toast('An error occurred', { type: 'error' });
          return;
        }

        router.replace('/');
        toast('Collection deleted', { type: 'success' });
      } catch (err) {
        console.error(err);
      } finally {
        setIsRemovingCollection(() => false);
      }
    }
  };

  const onBottomPageReached = async () => {
    await loadBookmarks();
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
                  className="block w-full bg-white/10 border-2 border-white/50 rounded-r-none border-r-0 rounded-xl outline-0 md:text-2xl px-3 py-2 focus:border-white"
                />
                <Button
                  onClick={updateCollectionName}
                  className="text-2xl md:text-4xl shrink-0 rounded-l-none"
                  disabled={isUpdatingCollectionTitle || !collectionTitle}
                >
                  {
                    isUpdatingCollectionTitle ? (
                      <AiOutlineLoading className="animate-spin" />
                    ) : (
                      <FiSave />
                    )
                  }
                </Button>
              </div>
              <hr className="border-white/40 mb-3" />
              {
                bookmarks.length > 0 ? (
                  <>
                    <ul>
                      {
                        bookmarks.map((bookmark) => (
                          <li
                            key={bookmark.id}
                            className="flex items-center justify-between gap-3 border-b border-white/20 last-of-type:border-b-0 p-3 first-of-type:pt-0"
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
                            <button
                              onClick={() => removeBookmark(bookmark)}
                              disabled={!!bookmarkToRemove}
                              className="opacity-50 active:opacity-100 md:hover:opacity-100 text-3xl shrink-0 disabled:pointer-events-none"
                            >
                              {
                                bookmarkToRemove?.id === bookmark.id ? (
                                  <AiOutlineLoading className="animate-spin" />
                                ) : (
                                  <FiMinusCircle />
                                )
                              }
                            </button>
                          </li>
                        ))
                      }
                    </ul>
                    <VisibilityObserver onVisible={onBottomPageReached} />
                  </>
                ) : (
                  <p className="text-center opacity-80 pb-3 md:pb-6">No bookmarks here.</p>
                )
              }
              <footer className="sticky bottom-0 bg-slate-950 border-t border-white/40 p-3">
                <Button
                  onClick={removeCollection}
                  disabled={isRemovingCollection}
                  className="w-full !bg-red-500 text-white flex items-center justify-center gap-1"
                >
                  {
                    isRemovingCollection && (
                      <AiOutlineLoading className="animate-spin" />
                    )
                  }
                  <span>Delete this collection</span>
                </Button>
              </footer>
            </div>
          )
        }
      </div>
    </Drawer>
  );
}
