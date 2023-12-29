'use client';

import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useSupabase } from '@/lib/composables/useSupabase';
import { Bookmark } from '@/types/bookmark';
import { AiOutlineLoading } from 'react-icons/ai';
import Button from '@/components/Button';
import { FiMinusCircle, FiSave } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useBookmarks } from '@/lib/composables/useBookmarks';
import Drawer from '@/components/Drawer';

interface Props {
    visible: boolean
    collectionId: string
    onHide?: () => void
}

export default function CollectionEditor({ visible, collectionId, onHide }: Props) {
  const supabase = useSupabase();
  const router = useRouter();

  const [isUpdatingCollectionName, setIsUpdatingCollectionName] = useState(false);
  const [bookmarkToRemove, setBookmarkToRemove] = useState<Bookmark|null>(null);
  const [isRemovingCollection, setIsRemovingCollection] = useState(false);

  const {
    collection,
    setCollection,
    bookmarks,
    setBookmarks,
    isLoading,
  } = useBookmarks(collectionId, { fetchCondition: visible });

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
      setIsUpdatingCollectionName(true);
      await supabase.from('bookmark_lists')
        .update({
          title: collectionTitle,
        })
        .eq('id', collectionId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingCollectionName(false);
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
        await supabase.from('bookmark_lists')
          .delete()
          .eq('id', collectionId);
        router.replace('/');
        toast('Collection deleted', { type: 'success' });
      } catch (err) {
        console.error(err);
      } finally {
        setIsRemovingCollection(() => false);
      }
    }
  };

  const ListView = useCallback(() => (
    <ul>
      {
        bookmarks.map((bookmark, index) => (
          <li
            key={index}
            className="flex items-center justify-between gap-3 border-b border-white/20 last-of-type:border-b-0 py-3 md:py-6 first-of-type:pt-0 -mx-3 md:-mx-6 px-3 md:px-6"
          >
            <div className="flex items-center gap-2 md:gap-3 flex-1 truncate">
              <img
                src={bookmark.image_url}
                alt={bookmark.title}
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
  ), [bookmarks, bookmarkToRemove, removeBookmark]);

  return (
    <Drawer
      visible={visible}
      onHide={onHide}
      fullscreen={true}
    >
      <div className="pt-6 px-3 md:px-6">
        {
          isLoading ? (
            <div className="flex justify-center mt-12">
              <AiOutlineLoading
                size={60}
                className="animate-spin opacity-50"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <input
                  value={collectionTitle}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setCollectionTitle(event.target.value)}
                  placeholder="Collection name"
                  className="block w-full bg-white/10 border-2 border-white/50 rounded-r-none border-r-0 rounded-xl outline-0 px-3 py-2 focus:border-white"
                />
                <Button
                  onClick={updateCollectionName}
                  className="text-2xl shrink-0 rounded-l-none"
                  disabled={isUpdatingCollectionName || !collectionTitle}
                >
                  {
                    isUpdatingCollectionName ? (
                      <AiOutlineLoading className="animate-spin" />
                    ) : (
                      <FiSave />
                    )
                  }
                </Button>
              </div>
              <hr className="border-white/40 my-3 md:my-6 -mx-3 md:-mx-6" />
              {
                bookmarks.length > 0 ? (
                  <ListView />
                ) : (
                  <p className="text-center opacity-80 pb-3 md:pb-6">No bookmarks here.</p>
                )
              }
              <footer className="sticky bottom-0 bg-slate-950 border-t border-white/40 p-3 md:p-6 -mx-3 md:-mx-6">
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
